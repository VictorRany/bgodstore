import Image from "next/image";
import type { ProductImage } from "@/lib/types";

interface MediaProps {
  image?: ProductImage;
  /** Texto do espaço reservado quando ainda não há foto real. */
  label: string;
  sizes?: string;
  priority?: boolean;
  /** object-position da foto (ex.: "50% 30%") para ajustar o enquadramento. */
  position?: string;
  className?: string;
  imgClassName?: string;
}

/**
 * Exibe uma foto otimizada (next/image) ou, enquanto a foto real não existir,
 * um espaço reservado neutro e honesto — nunca uma imagem inventada do produto.
 */
export function Media({ image, label, sizes = "100vw", priority, position, className = "", imgClassName = "" }: MediaProps) {
  return (
    <div className={`grain relative overflow-hidden bg-graphite ${className}`}>
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          style={position ? { objectPosition: position } : undefined}
          className={`object-cover ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center" role="img" aria-label={`${label} (foto em breve)`}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, rgba(242,240,235,0.08), transparent 60%), linear-gradient(180deg, #232323, #161616)",
            }}
          />
          <span aria-hidden className="display relative text-[clamp(1.4rem,3vw,2.4rem)] text-bone/[0.07]">
            B-GOD
          </span>
          <span aria-hidden className="eyebrow relative text-[9px] text-bone/35">
            {label} · foto em breve
          </span>
        </div>
      )}
    </div>
  );
}
