"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { HeroVisual } from "@/components/three/HeroVisual";
import { media } from "@/data/media";
import { site } from "@/data/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const scroll = useRef(0);
  const reduce = useReducedMotion();

  // Progresso de rolagem do hero num ref — o 3D lê sem causar re-render.
  useEffect(() => {
    const onScroll = () => {
      const h = section.current?.offsetHeight ?? window.innerHeight;
      scroll.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const line = (delay: number) => ({
    initial: reduce ? false : { y: "105%" },
    animate: { y: "0%" },
    transition: { duration: 1.2, delay, ease },
  });

  return (
    <section ref={section} aria-label="Campanha" className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Fundo de campanha (foto ou vídeo), quando fornecido */}
      {media.heroVideo ? (
        <video
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-55"
          src={media.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster={media.hero?.src}
        />
      ) : media.hero ? (
        <Image src={media.hero.src} alt={media.hero.alt} fill priority sizes="100vw" className="-z-10 object-cover opacity-55" />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(60% 55% at 62% 42%, rgba(242,240,235,0.07), transparent 70%)" }}
        />
      )}

      {/* Escultura 3D — atrás do texto, nunca intercepta cliques */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <HeroVisual scroll={scroll} />
      </div>

      <div className="px-gutter relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end pb-10 pt-28 md:pb-14">
        <motion.p
          className="eyebrow mb-6"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {site.city} — {site.state} · Coleção Summer 2026
        </motion.p>

        <h1 className="display text-[clamp(3.4rem,13.5vw,13rem)]">
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span className="block" {...line(0.1)}>
              Alto
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.04em]">
            <motion.span className="block" {...line(0.22)}>
              Padrão<span className="font-serif text-[0.5em] font-normal normal-case italic tracking-normal text-silver">, masculino.</span>
            </motion.span>
          </span>
        </h1>

        <motion.div
          className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease }}
        >
          <p className="max-w-sm text-sm leading-relaxed text-bone/70">
            Peças selecionadas para quem veste presença. {site.shipping}, com {site.service.toLowerCase()}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/loja">
              Conhecer a coleção <ArrowIcon width={16} height={16} />
            </Button>
            <Button href="/loja?sort=novidades" variant="outline">
              Lançamentos
            </Button>
          </div>
        </motion.div>
      </div>

      <div aria-hidden className="px-gutter mx-auto flex w-full max-w-[1600px] items-center justify-between border-t hairline py-4 text-[10px] uppercase tracking-[0.28em] text-steel">
        <span>B-GOD.STORE</span>
        <span className="hidden md:inline">{site.shipping}</span>
        <span className="flex items-center gap-3">
          Role
          <span className="relative h-6 w-px overflow-hidden bg-bone/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_ease-in-out_infinite] bg-bone" />
          </span>
        </span>
      </div>
    </section>
  );
}
