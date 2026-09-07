import { z } from "zod";

import { currencyCodeSchema } from "@/contracts/common";
import { pricePeriodSchema, propertyWriteSchema } from "@/contracts/property";

export const propertyFormSchema = propertyWriteSchema
  .omit({ currentPrice: true })
  .extend({
    slug: z.string().optional(),
    amount: z.number().int().positive().nullable(),
    currency: currencyCodeSchema,
    period: pricePeriodSchema,
  });

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;
