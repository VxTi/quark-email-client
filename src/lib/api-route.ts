import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';
import { type z, type ZodObject, type ZodRawShape } from 'zod/v4';

type Optional = true | false;
type UnwrapPromise<T> = T extends Promise<infer F> ? F : T;

type Session = UnwrapPromise<ReturnType<typeof auth.api.getSession>> & {};

type QueryParameters = Record<string, string | string[] | undefined>;

interface ErrorResponse {
  error: string;
}

type RequestParamsType = Record<string, unknown>;

type InferNullability<
  InitialType,
  OptionalNullable extends Optional,
> = OptionalNullable extends true ? InitialType : InitialType | undefined;

type BasicRequestHandler<RequestParameters> = (
  request: NextRequest,
  { params }: { params: Promise<RequestParameters> }
) => Promise<NextResponse>;

export type RequestHandler<
  RequestBody,
  StrictRequestProcessing extends Optional,
  RequiresAuthentication extends Optional,
  RequestParameters extends RequestParamsType | undefined,
> = ({
  request,
  data,
  session,
  searchParameters,
  params,
}: {
  request: NextRequest;
  data: InferNullability<RequestBody, StrictRequestProcessing>;
  session: InferNullability<Session, RequiresAuthentication>;
  searchParameters: QueryParameters;
  params: InferNullability<RequestParameters, StrictRequestProcessing>;
}) => Promise<NextResponse>;

export interface RouteConfig<
  StrictRequestProcessing extends Optional,
  RequiresAuthentication extends Optional,
  ZodRequestBodyValidator extends ZodRawShape,
  ZodRequestParamsValidator extends ZodRawShape,
> {
  /**
   * A boolean flag that indicates whether to enable verbose logging output.
   * If set to true, additional detailed information may be logged for debugging or analysis purposes.
   * This property is optional and defaults to false if not specified.
   */
  verbose?: boolean;
  /**
   * Whether the body validation is strictly required.
   * When set to `true`, if body validation fails, the handler
   * will return a 400 response.
   */
  strict?: StrictRequestProcessing;

  /**
   * The request handler. This handler is called after preprocessing has
   * succeeded, e.g., body validation or authentication.
   */
  handler: RequestHandler<
    z.infer<ZodObject<ZodRequestBodyValidator>>,
    StrictRequestProcessing,
    RequiresAuthentication,
    z.infer<ZodObject<ZodRequestParamsValidator>>
  >;

  /**
   * Validates whether the URL parameters are of the correct type,
   * e.g., `id` in `/product/[id]/...`
   */
  paramsValidator?: ZodObject<ZodRequestParamsValidator>;

  requestValidator?: {
    /**
     * The validator to use for the request data.
     * This checks whether the request data is valid, in `'body'` or `'query'` mode.
     * @see {@link RouteConfig.requestValidator.in}
     */
    validator: ZodObject<ZodRequestBodyValidator>;

    /**
     * Where to look for the request data.
     * Defaults to 'body'
     */
    in?: 'query' | 'body';
  };

  /**
   * Whether the route requires authentication.
   * Defaults to false
   */
  requiresAuthentication?: RequiresAuthentication;
}

export function createRoute<
  StrictRequestProcessing extends Optional,
  RequiresAuthentication extends Optional,
  ZodRequestBodyValidator extends ZodRawShape,
  ZodRequestParamsValidator extends ZodRawShape,
>(
  config: RouteConfig<
    StrictRequestProcessing,
    RequiresAuthentication,
    ZodRequestBodyValidator,
    ZodRequestParamsValidator
  >
): BasicRequestHandler<z.infer<ZodObject<ZodRequestParamsValidator>>> {
  return async function (
    request: NextRequest,
    {
      params,
    }: { params: Promise<z.infer<ZodObject<ZodRequestParamsValidator>>> }
  ): Promise<NextResponse> {
    try {
      let session: Session | null | undefined = undefined;
      let body: z.infer<ZodObject<ZodRequestBodyValidator>> | undefined =
        undefined;
      let processedParams:
        | z.infer<ZodObject<ZodRequestParamsValidator>>
        | undefined = undefined;

      if (config.requiresAuthentication) {
        session = await auth.api.getSession({
          headers: await headers(),
        });

        if (!session) {
          if (config.verbose) {
            console.debug('[401]: Unauthorized request');
          }

          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
      }

      const searchParams = new URL(request.url).searchParams;
      const searchParameters = Object.fromEntries(searchParams);

      if (config.requestValidator) {
        const validatorBody: unknown =
          config.requestValidator.in === 'query'
            ? searchParameters
            : await request.json();

        const validatorResult =
          await config.requestValidator.validator.safeParseAsync(validatorBody);

        body = validatorResult.success ? validatorResult.data : undefined;

        if (!validatorResult.success && config.strict) {
          logVerbose(
            config.verbose,
            '[400]: Request validation failed:',
            validatorResult.error.message
          );
          return NextResponse.json(
            { error: validatorResult.error.message },
            { status: 400 }
          );
        }
      }

      if (config.paramsValidator) {
        const requestParameters = await params;
        const validatedParams =
          await config.paramsValidator.safeParseAsync(requestParameters);

        processedParams = validatedParams.success
          ? validatedParams.data
          : undefined;

        if (!validatedParams.success && config.strict) {
          logVerbose(
            config.verbose,
            '[400]: Request validation failed:',
            validatedParams.error.message
          );

          return NextResponse.json(
            { error: validatedParams.error.message ?? 'Unknown error' },
            { status: 400 }
          );
        }
      }

      return config.handler({
        request,
        data: body as InferNullability<
          z.infer<ZodObject<ZodRequestBodyValidator>>,
          StrictRequestProcessing
        >,
        session: session as InferNullability<Session, RequiresAuthentication>,
        searchParameters,
        params: processedParams as InferNullability<
          z.infer<ZodObject<ZodRequestParamsValidator>>,
          StrictRequestProcessing
        >,
      });
    } catch (error) {
      logVerbose(config.verbose, '[500]: Error in API route handler:', error);

      return NextResponse.json(
        {
          error:
            'Internal server error. Please try again later. If the problem persists, please contact us at info@kaaspaleisdemare.nl',
        },
        {
          status: 500,
        }
      );
    }
  };
}

function logVerbose(
  verbose: boolean | undefined,
  message: string,
  ...args: unknown[]
): void {
  if (verbose) console.debug(message, ...args);
}
