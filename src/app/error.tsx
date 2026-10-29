"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="px-gutter mx-auto flex min-h-[70svh] max-w-[1600px] flex-col justify-center py-24">
      <p className="eyebrow mb-6">Algo saiu do lugar</p>
      <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight">Não foi possível carregar esta página.</h1>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button onClick={reset}>Tentar novamente</Button>
        <Button href="/" variant="outline">
          Página inicial
        </Button>
      </div>
    </section>
  );
}
