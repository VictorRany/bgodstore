"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { Category } from "@/lib/types";
import type { SortKey } from "@/lib/catalog";
import { SearchIcon } from "@/components/ui/icons";

const sorts: { value: SortKey; label: string }[] = [
  { value: "relevancia", label: "Relevância" },
  { value: "novidades", label: "Novidades" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
];

/** Filtros sincronizados com a URL — links de busca podem ser compartilhados. */
export function ShopFilters({
  categories,
  sizes,
  showCategory = true,
  total,
}: {
  categories: Category[];
  sizes: string[];
  showCategory?: boolean;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  function set(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  }

  const active = (key: string, value: string) => params.get(key) === value;
  const chip = (on: boolean) =>
    `h-9 border px-4 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
      on ? "border-bone bg-bone text-ink" : "border-bone/20 text-bone/75 hover:border-bone/60 hover:text-bone"
    }`;

  return (
    <div className={`space-y-6 transition-opacity ${pending ? "opacity-60" : ""}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          set("q", q.trim() || null);
        }}
        className="flex items-center gap-3 border-b border-bone/25 pb-2 focus-within:border-bone"
      >
        <SearchIcon className="text-silver" />
        <label htmlFor="loja-busca" className="sr-only">
          Buscar produtos
        </label>
        <input
          id="loja-busca"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar produtos"
          className="h-10 w-full bg-transparent text-lg placeholder:text-bone/30 focus:outline-none"
        />
      </form>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {showCategory && (
            <>
              <button type="button" className={chip(!params.get("categoria"))} onClick={() => set("categoria", null)}>
                Tudo
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={active("categoria", c.slug)}
                  className={chip(active("categoria", c.slug))}
                  onClick={() => set("categoria", active("categoria", c.slug) ? null : c.slug)}
                >
                  {c.name}
                </button>
              ))}
              <span className="mx-1 hidden w-px bg-bone/15 sm:block" />
            </>
          )}
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={active("tamanho", s)}
              aria-label={`Tamanho ${s}`}
              className={chip(active("tamanho", s))}
              onClick={() => set("tamanho", active("tamanho", s) ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-bone/75">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-bone"
              checked={params.get("disponivel") === "1"}
              onChange={(e) => set("disponivel", e.target.checked ? "1" : null)}
            />
            Disponíveis
          </label>
          <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-steel">
            Ordenar
            <select
              value={params.get("sort") ?? "relevancia"}
              onChange={(e) => set("sort", e.target.value === "relevancia" ? null : e.target.value)}
              className="h-9 border border-bone/20 bg-ink px-2 text-bone focus:border-bone focus:outline-none"
            >
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <p className="text-[11px] uppercase tracking-[0.2em] text-steel" aria-live="polite">
        {total} {total === 1 ? "produto" : "produtos"}
      </p>
    </div>
  );
}
