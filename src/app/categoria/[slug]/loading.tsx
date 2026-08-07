export default function Loading() {
  return (
    <div className="container-mf py-10 md:py-14">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-brand-tint" />
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square animate-pulse rounded-2xl bg-brand-tint" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-brand-tint" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-brand-tint" />
          </div>
        ))}
      </div>
    </div>
  );
}
