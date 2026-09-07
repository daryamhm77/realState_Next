import type { PropertyCard } from "@/contracts/property";
import { messages } from "@/messages";

export function formatPrice(price: PropertyCard["currentPrice"]) {
  if (!price) {
    return messages.properties.priceOnRequest;
  }

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount);

  return price.period === "MONTHLY"
    ? `${formatted} ${messages.properties.perMonth}`
    : formatted;
}
