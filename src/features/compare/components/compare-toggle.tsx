"use client";

import { Columns2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/lib/compare-store";
import { messages } from "@/messages";

const overlayIconClassName =
  "size-8 rounded-full bg-background/95 p-0 text-foreground shadow-sm ring-1 ring-foreground/10 [&_svg]:size-3.5";

export function CompareToggle({ propertyId }: { propertyId: string }) {
  const [hasHydrated, setHasHydrated] = useState(false);
  const selected = useCompareStore((state) => state.ids.includes(propertyId));
  const toggle = useCompareStore((state) => state.toggle);
  const isSelected = hasHydrated && selected;

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "secondary"}
      size="icon"
      className={overlayIconClassName}
      aria-pressed={isSelected}
      aria-label={
        isSelected ? messages.compare.removeLabel : messages.compare.addLabel
      }
      onClick={() => {
        const result = toggle(propertyId);

        if (!result.ok) {
          toast.error(messages.compare.full);
        }
      }}
    >
      <Columns2Icon />
    </Button>
  );
}
