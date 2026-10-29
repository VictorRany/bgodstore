import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Sacola",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="px-gutter mx-auto max-w-[1600px]">
      <PageHeader crumbs={[{ href: "/", label: "Início" }, { label: "Sacola" }]} title="Sacola" />
      <CartView />
    </div>
  );
}
