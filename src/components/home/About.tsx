import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { media } from "@/data/media";
import { site } from "@/data/site";

/** Texto institucional baseado apenas em informações públicas verificadas da BGOD. */
export function About() {
  const facts = [
    { k: "Origem", v: `${site.city}, ${site.state}` },
    { k: "Entrega", v: site.shipping },
    { k: "Atendimento", v: site.service },
  ];

  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="px-gutter mx-auto max-w-[1600px] scroll-mt-24 py-28 md:py-40">
      <div className="grid gap-14 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          <Media image={media.institutional} label="Foto institucional" sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[3/4]" />
        </Reveal>

        <div className="flex flex-col justify-between md:col-span-6 md:col-start-7">
          <Reveal>
            <p className="eyebrow mb-6">A BGOD</p>
            <h2 id="sobre-titulo" className="font-serif text-[clamp(2.2rem,4.6vw,4.4rem)] leading-[1.02]">
              Moda masculina de <em className="text-silver">alto padrão</em>, escolhida peça por peça.
            </h2>
            <p className="mt-8 max-w-lg leading-relaxed text-bone/70">
              Sempre trazendo as melhores e mais atualizadas coleções — com muita qualidade, estilo e aquele padrão B-god
              Store. De {site.city} para todo o Brasil, com atendimento feito pessoa a pessoa.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <dl className="mt-16 grid gap-px border hairline bg-bone/10 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.k} className="bg-ink p-6">
                  <dt className="eyebrow text-[9px]">{f.k}</dt>
                  <dd className="mt-3 text-sm uppercase tracking-[0.08em]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
