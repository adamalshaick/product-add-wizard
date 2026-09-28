import { PAGE_SIZE } from "./constants";

const rows = Array.from({ length: PAGE_SIZE }, (_, index) => index);

export function ProductsListSkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <div className="h-12 border-b border-border bg-muted/50" />
        {rows.map((row) => (
          <div
            key={row}
            className="flex h-15 items-center border-b border-border px-5 last:border-b-0"
          >
            <div className="h-4 w-40 rounded bg-muted" />
          </div>
        ))}
        <div className="h-14 border-t border-border" />
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {rows.map((row) => (
          <div
            key={row}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="mt-2 h-4 w-24 rounded bg-muted" />
            <div className="mt-4 h-16 rounded-lg bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
