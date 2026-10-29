import { NextResponse } from "next/server";
import { isShopifyEnabled, shopifyCreateCheckout } from "@/lib/commerce/shopify";
import { MAX_QTY } from "@/lib/cart";

interface Body {
  lines?: { variantId?: unknown; quantity?: unknown }[];
}

export async function POST(request: Request) {
  if (!isShopifyEnabled()) {
    return NextResponse.json({ error: "Checkout online ainda não configurado." }, { status: 501 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const lines = Array.isArray(body.lines) ? body.lines.slice(0, 50) : [];
  const valid = lines.filter(
    (l): l is { variantId: string; quantity: number } =>
      typeof l.variantId === "string" &&
      l.variantId.startsWith("gid://shopify/ProductVariant/") &&
      Number.isInteger(l.quantity) &&
      (l.quantity as number) >= 1 &&
      (l.quantity as number) <= MAX_QTY,
  );
  if (valid.length === 0 || valid.length !== lines.length) {
    return NextResponse.json({ error: "Itens do carrinho inválidos. Atualize a página e tente novamente." }, { status: 400 });
  }

  try {
    // Preço e estoque são revalidados pela própria Shopify — o cliente não define valores.
    const url = await shopifyCreateCheckout(valid.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })));
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[checkout]", error);
    return NextResponse.json({ error: "Não foi possível iniciar o pagamento. Tente novamente." }, { status: 502 });
  }
}
