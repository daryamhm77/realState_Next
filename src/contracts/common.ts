import { z } from "zod";

export const idSchema = z.string().min(1);
export const slugSchema = z.string().min(1);
export const currencyCodeSchema = z.string().length(3);

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});

export type Pagination = z.infer<typeof paginationSchema>;
