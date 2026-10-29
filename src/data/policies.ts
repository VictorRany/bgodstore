/**
 * Políticas da loja. O conteúdo ainda NÃO foi fornecido pela BGOD — por isso
 * cada página mostra um aviso de "em preparação" em vez de regras inventadas.
 * Preencha `body` (parágrafos) com o texto oficial e remova `pending`.
 */
export interface Policy {
  slug: string;
  title: string;
  summary: string;
  body: string[];
  pending?: boolean;
}

export const policies: Policy[] = [
  {
    slug: "envio",
    title: "Envio e frete",
    summary: "Prazos, valores e modalidades de entrega.",
    body: ["A BGOD envia para todo o Brasil. Prazos e valores de frete são informados no atendimento."],
    pending: true,
  },
  {
    slug: "trocas",
    title: "Trocas e devoluções",
    summary: "Como solicitar troca ou devolução.",
    body: [],
    pending: true,
  },
  {
    slug: "pagamento",
    title: "Formas de pagamento",
    summary: "Meios de pagamento aceitos.",
    body: [],
    pending: true,
  },
  {
    slug: "privacidade",
    title: "Privacidade",
    summary: "Como tratamos seus dados (LGPD).",
    body: [
      "O carrinho deste site é salvo apenas no seu navegador. Dados de pagamento nunca são processados ou armazenados por este site.",
    ],
    pending: true,
  },
];
