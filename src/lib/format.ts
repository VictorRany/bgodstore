const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata centavos como BRL. `null` vira "Sob consulta". */
export function formatPrice(cents: number | null | undefined) {
  if (cents == null) return "Sob consulta";
  return brl.format(cents / 100);
}

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
