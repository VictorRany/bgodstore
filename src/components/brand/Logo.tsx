import Image from "next/image";

/**
 * Logotipo oficial em /public/brand/logo.jpg (busto com coroa + "B-GOD STORE").
 * O arquivo atual tem 150×150 px — substitua por uma versão em SVG ou PNG ≥ 600 px
 * com o mesmo nome para ganhar nitidez em telas retina.
 *
 * - `mark`: só o busto com coroa (recortado do topo do arquivo) + wordmark em texto.
 * - `full`: o logo completo, como no Instagram.
 */
export function Logo({ variant = "mark", className = "" }: { variant?: "mark" | "full"; className?: string }) {
  if (variant === "full") {
    return (
      <Image
        src="/brand/logo.jpg"
        alt="B-GOD Store"
        width={150}
        height={150}
        className={`mix-blend-lighten ${className}`}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-[0.55em] leading-none ${className}`}>
      <span className="relative block h-[2.3em] w-[2.3em] overflow-hidden">
        <Image
          src="/brand/logo.jpg"
          alt=""
          width={150}
          height={150}
          priority
          className="absolute left-1/2 top-[-6%] h-auto w-[175%] max-w-none -translate-x-1/2 mix-blend-lighten"
        />
      </span>
      <span className="flex flex-col items-start" aria-label="B-GOD Store">
        <span aria-hidden className="display text-[1.15em] tracking-[-0.02em]">
          B-GOD
        </span>
        <span aria-hidden className="mt-[0.3em] text-[0.48em] font-medium tracking-[0.62em] text-silver">STORE</span>
      </span>
    </span>
  );
}
