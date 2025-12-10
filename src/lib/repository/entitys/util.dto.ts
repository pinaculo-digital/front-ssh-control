import type z from "zod";
import { SignInSchema } from "../controllers/auth.controller";
import type { Schema, ZodIssue } from "zod/v3";
import type { ZodObject } from "zod";

export interface ResponseList<T> {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  data: T[];
}

export interface QueryPagination {
  limit: number;
  page: number;
}

export function validateSchema<T extends ZodObject<any>>(
  schema: T,
  data: unknown
): { valid: boolean; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {} };
  }

  // Constrói erros no formato { campo: "mensagem" }
  const errors: Record<string, string> = {};

  result.error.issues.forEach((issue: z.core.$ZodIssue) => {
    const path = issue.path.join(".");
    const field = path || "unknown";
    errors[field] = issue.message;
  });

  return { valid: false, errors };
}
