import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { formatPrice } from "@/lib/format";
import { isSoldOut } from "@/lib/catalog";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [first, second] = product.images;
  const soldOut = isSoldOut(product);
  const sizes = product.variants.filter((v) => v.available && v.size).map((v) => v.size);

  return (
    <Link href={`/produto/${product.slug}`} className="group block focus-visible:outline-offset-4">
      <div className="relative">
        <Media
          image={first}
          label={product.name}
          priority={priority}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="aspect-[4/5]"
          imgClassName="transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]"
        />
        {second && (
          <Media
            image={second}
            label={product.name}
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="!absolute inset-0 aspect-[4/5] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        {/* Moldura de luz no hover — sutil, sem brilho exagerado */}
        <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-bone/0 transition duration-700 group-hover:ring-bone/20" />

        <div className="absolute left-3 top-3 flex gap-1.5">
          {product.isNew && <Badge>Novo</Badge>}
          {soldOut && <Badge muted>Esgotado</Badge>}
          {product.demo && <Badge muted>Demo</Badge>}
        </div>

        {sizes.length > 0 && !soldOut && (
          <div className="absolute inset-x-0 bottom-0 hidden translate-y-2 items-center gap-3 bg-ink/70 px-3 py-2.5 text-[10px] uppercase tracking-[0.2em] text-bone/85 opacity-0 backdrop-blur-md transition duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100 md:flex">
            <span className="text-steel">Tam.</span>
            {sizes.join(" · ")}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {product.brand && <p className="eyebrow mb-1 text-[9px]">{product.brand}</p>}
          <h3 className="truncate text-[13px] uppercase tracking-[0.08em]">{product.name}</h3>
        </div>
        <p className="shrink-0 text-[13px] tabular-nums text-bone/80">
          {product.compareAtPrice && (
            <span className="mr-2 text-steel line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}

function Badge({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span
      className={`px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${
        muted ? "bg-ink/80 text-silver backdrop-blur" : "bg-bone text-ink"
      }`}
    >
      {children}
    </span>
  );
}
