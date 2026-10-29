export default function Loading() {
  return (
    <div className="px-gutter mx-auto max-w-[1600px] pt-20" aria-busy="true" aria-label="Carregando">
      <div className="h-24 w-2/3 animate-pulse bg-graphite/60" />
      <div className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse bg-graphite/50" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
    </div>
  );
}
