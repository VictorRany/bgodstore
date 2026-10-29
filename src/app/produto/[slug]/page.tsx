import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { AddToCart } from "@/components/product/AddToCart";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/home/SectionHeading";
import { getCategory, getProduct, getProducts } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return {};
  const image = product.images[0];
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    alternates: { canonical: `/produto/${product.slug}` },
    // Itens de demonstração não devem ser indexados.
    robots: product.demo ? { index: false, follow: true } : undefined,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: image ? [{ url: image.src, alt: image.alt }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const [category, all] = await Promise.all([getCategory(product.category), getProducts()]);
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const fallbackRelated = related.length ? related : all.filter((p) => p.id !== product.id).slice(0, 4);

  const jsonLd = !product.demo && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.src),
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers:
      product.price != null
        ? {
            "@type": "Offer",
            priceCurrency: "BRL",
            price: (product.price / 100).toFixed(2),
            availability: product.variants.some((v) => v.available)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${site.url}/produto/${product.slug}`,
          }
        : undefined,
  };

  return (
    <div className="px-gutter mx-auto max-w-[1600px]">
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      )}

      <div className="grid gap-10 pt-6 md:grid-cols-12 md:gap-12 md:pt-10">
        <div className="md:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="md:col-span-5">
          <div className="md:sticky md:top-24">
            <Breadcrumbs
              crumbs={[
                { href: "/loja", label: "Loja" },
                ...(category ? [{ href: `/categoria/${category.slug}`, label: category.name }] : []),
                { label: product.name },
              ]}
            />
            <div className="mt-8">
              {product.brand && <p className="eyebrow mb-3">{product.brand}</p>}
              <h1 className="display text-[clamp(2.2rem,4.4vw,4rem)]">{product.name}</h1>
              <p className="mt-5 flex items-baseline gap-3 text-xl tabular-nums">
                {product.compareAtPrice && (
                  <span className="text-base text-steel line-through">{formatPrice(product.compareAtPrice)}</span>
                )}
                {formatPrice(product.price)}
              </p>
              {product.demo && (
                <p className="mt-3 inline-block border hairline px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-silver">
                  Item de demonstração
                </p>
              )}

              <div className="mt-10">
                <AddToCart product={product} sizeOptions={category?.sizes} whatsapp={site.whatsapp} siteUrl={site.url} />
              </div>

              <div className="mt-10 divide-y divide-bone/10 border-y hairline">
                <Detail title="Descrição" open>
                  <p className="leading-relaxed text-bone/75">{product.description}</p>
                </Detail>
                {product.details && product.details.length > 0 && (
                  <Detail title="Detalhes">
                    <ul className="list-inside list-disc space-y-1 text-bone/75 marker:text-steel">
                      {product.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </Detail>
                )}
                <Detail title="Envio e trocas">
                  <p className="text-bone/75">
                    {site.shipping}. Veja{" "}
                    <Link href="/politicas/envio" className="underline underline-offset-4 hover:text-bone">
                      envio e frete
                    </Link>{" "}
                    e{" "}
                    <Link href="/politicas/trocas" className="underline underline-offset-4 hover:text-bone">
                      trocas e devoluções
                    </Link>
                    .
                  </p>
                </Detail>
              </div>
            </div>
          </div>
        </div>
      </div>

      {fallbackRelated.length > 0 && (
        <section aria-label="Relacionados" className="pt-32">
          <SectionHeading eyebrow="Combine com" title="Você também" accent="pode gostar" />
          <ProductGrid products={fallbackRelated} />
        </section>
      )}
    </div>
  );
}

function Detail({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group py-5" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between text-[11px] uppercase tracking-[0.24em] [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="text-lg leading-none text-silver transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="pt-4 text-sm">{children}</div>
    </details>
  );
}
