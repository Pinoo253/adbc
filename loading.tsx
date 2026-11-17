export default function Loading() {
  return (
    <div className="container-x py-24" role="status" aria-live="polite">
      <div className="h-4 w-32 animate-pulse rounded-full bg-ice" />
      <div className="mt-5 h-14 w-3/4 max-w-2xl animate-pulse rounded-2xl bg-ice" />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] animate-pulse rounded-3xl bg-ice" />
        ))}
      </div>
      <span className="sr-only">Memuat…</span>
    </div>
  );
}
