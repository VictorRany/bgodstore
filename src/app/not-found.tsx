import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="px-gutter mx-auto flex min-h-[70svh] max-w-[1600px] flex-col justify-center py-24">
      <p className="eyebrow mb-6">Erro 404</p>
      <h1 className="display text-[clamp(3.5rem,14vw,12rem)]">
        Fora
        <span className="font-serif text-[0.45em] font-normal normal-case italic tracking-normal text-silver"> de estoque.</span>
      </h1>
      <p className="mt-8 max-w-md text-bone/70">A página que você procura não existe ou foi movida.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/loja">Ir para a loja</Button>
        <Button href="/" variant="outline">
          Página inicial
        </Button>
      </div>
    </section>
  );
}
