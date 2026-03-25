import {
  TooltipContent,
  TooltipRoot,
  TooltipTrigger,
} from 'prosekit/react/tooltip';
import type { MouseEventHandler, ReactNode } from 'react';

interface Props {
  pressed?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
  children: ReactNode;
}

function TooltipLabel({ text }: { text: string }) {
  return (
    <TooltipContent className="bg-primary text-primary-foreground motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:animate-duration-150 motion-safe:data-[state=closed]:animate-duration-200 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=top]:slide-in-from-bottom-2 z-50 rounded-md px-2.5 py-1 text-xs shadow-sm will-change-transform [&:not([data-state])]:hidden">
      {text}
    </TooltipContent>
  );
}

export default function EmailInputToolbarButton({
  pressed,
  disabled,
  onClick,
  tooltip,
  children,
}: Props) {
  return (
    <TooltipRoot>
      <TooltipTrigger className="block">
        <button
          type="button"
          data-state={pressed ? 'on' : 'off'}
          disabled={disabled}
          onClick={onClick}
          onMouseDown={e => {
            e.preventDefault();
          }}
          className="text-foreground focus-visible:ring-ring/30 hover:bg-accent data-[state=on]:bg-border flex cursor-pointer items-center justify-center rounded p-1.5 transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-40"
        >
          {children}
          {tooltip ? <span className="sr-only">{tooltip}</span> : null}
        </button>
      </TooltipTrigger>
      {tooltip ? <TooltipLabel text={tooltip} /> : null}
    </TooltipRoot>
  );
}
