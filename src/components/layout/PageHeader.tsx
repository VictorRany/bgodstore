import Link from "next/link";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Trilha de navegação">
      <ol className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-steel">
        {crumbs.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {c.href ? (
              <Link href={c.href} className="hover:text-bone">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-silver">
                {c.label}
              </span>
            )}
            {i < crumbs.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ crumbs, title, accent, children }: { crumbs: Crumb[]; title: string; accent?: string; children?: React.ReactNode }) {
  return (
    <div className="pb-10 pt-12 md:pt-20">
      <Breadcrumbs crumbs={crumbs} />
      <h1 className="display mt-6 text-[clamp(3rem,10vw,9rem)]">
        {title}
        {accent && <span className="font-serif text-[0.45em] font-normal normal-case italic tracking-normal text-silver"> {accent}</span>}
      </h1>
      {children}
    </div>
  );
}
