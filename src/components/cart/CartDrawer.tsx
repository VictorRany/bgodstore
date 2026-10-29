"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "@/components/ui/icons";
import { useCart } from "@/store/cart";
import { useMounted } from "@/lib/use-mounted";
import { CartLineItem } from "./CartLineItem";
import { totalLabel } from "./CartView";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const { lines, open, setOpen } = useCart();
  const mounted = useMounted();
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Sacola"
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-md flex-col border-l hairline bg-ink"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b hairline px-6 py-5">
              <h2 className="eyebrow text-bone">Sacola ({lines.length})</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Fechar sacola" className="-mr-2 p-2" autoFocus>
                <CloseIcon />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="font-serif text-3xl italic text-bone/80">Sua sacola está vazia.</p>
                <Button href="/loja" variant="outline">
                  Explorar a loja
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-bone/10 overflow-y-auto px-6">
                  {lines.map((line) => (
                    <CartLineItem key={line.variantId} line={line} compact />
                  ))}
                </ul>
                <div className="space-y-4 border-t hairline px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="eyebrow">Total parcial</span>
                    <span className="text-lg">{totalLabel(lines)}</span>
                  </div>
                  <p className="text-xs text-steel">Envio para todo o Brasil — frete combinado no atendimento.</p>
                  <Button href="/checkout" className="w-full">
                    Finalizar pedido
                  </Button>
                  <Link href="/carrinho" className="block text-center text-xs uppercase tracking-[0.2em] text-silver hover:text-bone">
                    Ver sacola completa
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
