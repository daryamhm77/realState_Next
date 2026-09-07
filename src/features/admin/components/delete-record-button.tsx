"use client";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { messages } from "@/messages";

type DeleteRecordButtonProps = {
  onConfirm: () => Promise<unknown>;
  isPending: boolean;
};

export function DeleteRecordButton({
  onConfirm,
  isPending,
}: DeleteRecordButtonProps) {
  async function handleConfirm() {
    try {
      await onConfirm();
      toast.success(messages.admin.deleted);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.admin.genericError,
      );
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        {messages.admin.delete}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{messages.admin.deleteConfirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {messages.admin.deleteConfirmDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{messages.admin.cancel}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirm}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            {messages.admin.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
