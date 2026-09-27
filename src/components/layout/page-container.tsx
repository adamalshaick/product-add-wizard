import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto box-content max-w-page px-4 py-6 md:py-12.5",
        className,
      )}
      {...props}
    />
  );
}
