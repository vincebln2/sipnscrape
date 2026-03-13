export function BeanCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-3 w-20 bg-muted rounded mb-2" />
          <div className="h-5 w-40 bg-muted rounded" />
        </div>
        <div className="w-12 h-12 rounded-full bg-muted" />
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-4 w-14 bg-muted rounded-sm" />
        <div className="h-4 w-16 bg-muted rounded-sm" />
      </div>
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 w-16 bg-muted rounded-full" />
        <div className="h-5 w-14 bg-muted rounded-full" />
        <div className="h-5 w-20 bg-muted rounded-full" />
      </div>
      <div className="h-px bg-border mt-4" />
      <div className="h-4 w-24 bg-muted rounded mt-3" />
    </div>
  );
}
