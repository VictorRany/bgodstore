import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutView } from "@/components/cart/CheckoutView";
import { isShopifyEnabled } from "@/lib/commerce/shopify";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Finalizar compra",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="px-gutter mx-auto max-w-[1600px]">
      <PageHeader
        crumbs={[{ href: "/", label: "Início" }, { href: "/carrinho", label: "Sacola" }, { label: "Finalizar" }]}
        title="Finalizar"
      />
      <CheckoutView
        shopify={isShopifyEnabled()}
        whatsapp={site.whatsapp}
        siteUrl={site.url}
        instagramUrl={site.instagram.url}
      />
    </div>
  );
}
