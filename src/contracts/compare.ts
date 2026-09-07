import { z } from "zod";

import { idSchema } from "@/contracts/common";

export const COMPARE_LIMIT = 3;

export const compareIdsSchema = z.object({
  ids: z.array(idSchema).max(COMPARE_LIMIT),
});

export const compareIdsQuerySchema = z.object({
  ids: z
    .string()
    .transform((value) =>
      value
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean),
    )
    .pipe(z.array(idSchema).max(COMPARE_LIMIT)),
});

export type CompareIds = z.infer<typeof compareIdsSchema>;
