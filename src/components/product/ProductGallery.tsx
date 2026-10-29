"use client";

import { useState } from "react";
import { Media } from "@/components/ui/Media";
import type { ProductImage } from "@/lib/types";

/** Mobile: carrossel com rolagem nativa. Desktop: imagens empilhadas (estilo editorial). */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const list: (ProductImage | undefined)[] = images.length ? images : [undefined, undefined];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible"
        onScroll={(e) => {
          const el = e.currentTarget;
          setActive(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {list.map((img, i) => (
          <Media
            key={i}
            image={img}
            label={name}
            priority={i === 0}
            sizes="(min-width: 768px) 30vw, 100vw"
            className={`aspect-[4/5] w-full shrink-0 snap-center ${i === 0 ? "md:col-span-2" : ""}`}
          />
        ))}
      </div>
      {list.length > 1 && (
        <div className="mt-4 flex justify-center gap-2 md:hidden" aria-hidden>
          {list.map((_, i) => (
            <span key={i} className={`h-px w-6 transition-colors ${i === active ? "bg-bone" : "bg-bone/25"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
