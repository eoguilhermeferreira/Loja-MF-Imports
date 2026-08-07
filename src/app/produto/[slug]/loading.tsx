export default function Loading() {
  return (
    <div className="container-mf py-6 md:py-10">
      <div className="h-4 w-16 animate-pulse rounded bg-brand-tint" />
      <div className="mt-5 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="aspect-square animate-pulse rounded-2xl bg-brand-tint" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 animate-pulse rounded bg-brand-tint" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-brand-tint" />
          <div className="h-9 w-40 animate-pulse rounded bg-brand-tint" />
          <div className="h-24 w-full animate-pulse rounded bg-brand-tint" />
        </div>
      </div>
    </div>
  );
}
