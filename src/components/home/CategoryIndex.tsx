import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/ui/Reveal";
import type { Category } from "@/lib/types";

/** Índice tipográfico de categorias — funciona bem mesmo antes das fotos chegarem. */
export function CategoryIndex({ categories, counts }: { categories: Category[]; counts: Record<string, number> }) {
  return (
    <ul className="border-t hairline">
      {categories.map((c, i) => (
        <Reveal as="li" key={c.slug} delay={i * 0.05}>
          <Link
            href={`/categoria/${c.slug}`}
            className="group relative flex items-center gap-6 overflow-hidden border-b hairline py-6 md:py-8"
          >
            <span
              aria-hidden
              className="absolute inset-0 origin-bottom scale-y-0 bg-bone transition-transform duration-700 ease-luxe group-hover:scale-y-100"
            />
            <span className="relative w-10 text-[11px] tabular-nums text-steel transition-colors duration-500 group-hover:text-ink/60">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="display relative flex-1 text-[clamp(2.2rem,7vw,6.5rem)] transition-[color,transform] duration-700 ease-luxe group-hover:translate-x-3 group-hover:text-ink">
              {c.name}
            </span>
            <span className="relative hidden max-w-[16rem] text-sm text-silver transition-colors duration-500 group-hover:text-ink/70 md:block">
              {c.description}
            </span>
            <span className="relative flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-silver transition-colors duration-500 group-hover:text-ink">
              {counts[c.slug] ?? 0} {counts[c.slug] === 1 ? "peça" : "peças"}
              <ArrowIcon className="-rotate-45 transition-transform duration-700 ease-luxe group-hover:rotate-0" />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
