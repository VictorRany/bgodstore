import { ProductCard } from "./ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4">
      {products.map((p, i) => (
        <Reveal as="li" key={p.id} delay={(i % 4) * 0.08}>
          <ProductCard product={p} priority={i < priorityCount} />
        </Reveal>
      ))}
    </ul>
  );
}
