import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  side = "right",
  title,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  side?: "right" | "bottom";
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70" />
      <Dialog.Content
        className={cn(
          "fixed z-50 bg-surface shadow-[var(--shadow-border)]",
          side === "right" &&
            "inset-y-0 right-0 flex h-full w-[min(100%,20rem)] flex-col",
          side === "bottom" &&
            "inset-x-0 bottom-0 max-h-[80dvh] rounded-t-xl",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Dialog.Title className="font-display text-sm font-semibold">
            {title}
          </Dialog.Title>
          <Dialog.Close className="flex size-11 items-center justify-center text-muted hover:text-fg">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
