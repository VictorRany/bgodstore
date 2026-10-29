"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { media } from "@/data/media";

export function EditorialBanner() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "8%"]);
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["30%", "-30%"]);

  return (
    <section ref={ref} aria-label="Campanha editorial" className="relative h-[92svh] min-h-[560px] overflow-hidden">
      <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
        <Media
          image={media.editorial}
          position={media.editorial?.position}
          label="Foto editorial da campanha"
          sizes="100vw"
          className="h-full w-full"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/40" />

      <motion.div style={{ y: textY }} className="px-gutter relative mx-auto flex h-full max-w-[1600px] flex-col items-start justify-end pb-16 md:pb-24">
        <p className="eyebrow mb-6">Coleção Summer 2026</p>
        <h2 className="display max-w-5xl text-[clamp(2.8rem,9vw,9rem)]">
          Do social
          <br />
          <span className="font-serif text-[0.6em] font-normal normal-case italic tracking-normal text-bone/85">
            ao casual.
          </span>
        </h2>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-bone/75">
          O que importa é o conforto e a sua individualidade refletida nas suas peças.
        </p>
        <Button href="/loja" variant="outline" className="mt-10">
          Ver a coleção
        </Button>
      </motion.div>
    </section>
  );
}
