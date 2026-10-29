/**
 * Informações institucionais da BGOD.
 *
 * Tudo aqui foi verificado no perfil público @bgod.store. Campos marcados como
 * `null` ainda precisam ser confirmados pela loja — o site oculta o que estiver vazio.
 */
export const site = {
  name: "B-GOD.STORE",
  shortName: "BGOD",
  tagline: "Moda masculina de alto padrão",
  description:
    "BGOD Store — moda masculina de alto padrão em João Pessoa, com envio para todo o Brasil e atendimento personalizado.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  city: "João Pessoa",
  state: "PB",
  country: "Brasil",
  shipping: "Envio para todo o Brasil",
  service: "Atendimento personalizado",
  instagram: {
    handle: "@bgod.store",
    url: "https://www.instagram.com/bgod.store/",
  },
  /** Número no formato internacional, só dígitos (ex.: 5583999999999). */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  /** CNPJ, razão social e endereço — preencher antes de publicar. */
  legal: {
    companyName: null as string | null,
    cnpj: null as string | null,
    address: null as string | null,
  },
} as const;

export function whatsappLink(message?: string) {
  if (!site.whatsapp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.whatsapp}${text}`;
}
