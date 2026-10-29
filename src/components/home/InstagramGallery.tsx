import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon } from "@/components/ui/icons";
import { media } from "@/data/media";
import { site } from "@/data/site";

const SLOTS = 6;

/**
 * Galeria no estilo do feed. Usa as fotos listadas em src/data/media.ts (gallery);
 * os espaços restantes ficam como reservados até a loja enviar as imagens.
 */
export function InstagramGallery() {
  const items = Array.from({ length: SLOTS }, (_, i) => media.gallery[i]);

  return (
    <section aria-labelledby="galeria-titulo" className="px-gutter mx-auto max-w-[1600px] py-24">
      <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-4">No feed</p>
          <h2 id="galeria-titulo" className="display text-[clamp(2.4rem,6.5vw,6rem)]">
            {site.instagram.handle}
          </h2>
        </div>
        <a
          href={site.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 self-start text-[11px] uppercase tracking-[0.24em] text-bone/80 hover:text-bone"
        >
          <InstagramIcon width={16} height={16} /> Seguir no Instagram
        </a>
      </Reveal>

      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        {items.map((img, i) => (
          <Reveal as="li" key={i} delay={i * 0.06}>
            <a
              href={img?.href ?? site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden"
              aria-label={img ? `${img.alt} — abrir no Instagram` : "Abrir Instagram da BGOD"}
            >
              <Media
                image={img}
                label={`Post ${i + 1}`}
                sizes="(min-width: 1024px) 16vw, 50vw"
                className="aspect-square transition-[filter] duration-700 group-hover:brightness-110"
                imgClassName="grayscale-[30%] transition duration-[1.2s] ease-luxe group-hover:scale-105 group-hover:grayscale-0"
              />
            </a>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
