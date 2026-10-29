import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { SectionHeading } from "@/components/home/SectionHeading";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { About } from "@/components/home/About";
import { InstagramGallery } from "@/components/home/InstagramGallery";
import { Newsletter } from "@/components/home/Newsletter";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getCategories, getFeatured, getNewArrivals, getProducts } from "@/lib/commerce";
import { isNewsletterEnabled } from "@/lib/newsletter";

export default async function Home() {
  const [all, newArrivals, featured, categories] = await Promise.all([
    getProducts(),
    getNewArrivals(),
    getFeatured(),
    getCategories(),
  ]);
  const counts = Object.fromEntries(categories.map((c) => [c.slug, all.filter((p) => p.category === c.slug).length]));

  return (
    <>
      <Hero />
      <Marquee />

      {newArrivals.length > 0 && (
        <section aria-label="Lançamentos" className="px-gutter mx-auto max-w-[1600px] py-24 md:py-32">
          <SectionHeading index="01" eyebrow="Recém-chegados" title="Lançamentos" href="/loja?sort=novidades" />
          <ProductGrid products={newArrivals.slice(0, 4)} />
        </section>
      )}

      <section aria-label="Categorias" className="px-gutter mx-auto max-w-[1600px] py-16 md:py-24">
        <SectionHeading index="02" eyebrow="Navegue por" title="Categorias" />
        <CategoryIndex categories={categories} counts={counts} />
      </section>

      <EditorialBanner />

      {featured.length > 0 && (
        <section aria-label="Destaques" className="px-gutter mx-auto max-w-[1600px] py-24 md:py-32">
          <SectionHeading index="03" eyebrow="Seleção" title="Destaques" accent="da casa" href="/loja" />
          <ProductGrid products={featured} />
        </section>
      )}

      <About />
      <InstagramGallery />
      {isNewsletterEnabled() && <Newsletter />}
    </>
  );
}
