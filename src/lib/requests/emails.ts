import { ApiEmailSchema, type ApiEmail, type EmailData } from "@/models/email";
import { request } from "@/lib/utils";
import { z } from "zod";

export async function fetchEmails(): Promise<ApiEmail[]> {
  return request("/api/emails", {
    decoder: z.array(ApiEmailSchema),
  });
}

export async function saveEmail(data: EmailData): Promise<ApiEmail> {
  return request("/api/emails", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
    decoder: ApiEmailSchema,
  });
}
