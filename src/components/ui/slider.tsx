import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-elevated">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block size-4 rounded-full bg-fg shadow-[0_0_0_4px_rgb(7_9_12),0_0_0_5px_rgb(62_224_234_/_0.7)] outline-none focus-visible:shadow-[0_0_0_4px_rgb(7_9_12),0_0_0_6px_rgb(62_224_234)]" />
    </SliderPrimitive.Root>
  );
}
