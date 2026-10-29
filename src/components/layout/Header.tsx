"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/brand/Logo";
import { BagIcon, CloseIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { categories } from "@/data/categories";
import { useCart } from "@/store/cart";
import { itemCount } from "@/lib/cart";
import { useMounted } from "@/lib/use-mounted";

const nav = [
  { href: "/loja", label: "Loja" },
  { href: "/loja?sort=novidades", label: "Lançamentos" },
  ...categories.slice(0, 3).map((c) => ({ href: `/categoria/${c.slug}`, label: c.name })),
  { href: "/#sobre", label: "A BGOD" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const setCartOpen = useCart((s) => s.setOpen);
  const mounted = useMounted();
  const count = mounted ? itemCount(lines) : 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const solid = scrolled || !isHome || menuOpen;

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-luxe ${
          isHome ? "-mb-[var(--header-h)]" : ""
        } ${solid ? "border-b hairline bg-ink/80 backdrop-blur-xl" : "border-b border-transparent bg-transparent"}`}
        style={{ ["--header-h" as string]: "64px" }}
      >
        <div className="px-gutter mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6">
          <div className="flex flex-1 items-center gap-8">
            <button
              type="button"
              className="-ml-2 p-2 lg:hidden"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group relative text-[11px] font-medium uppercase tracking-[0.22em] text-bone/80 transition-colors hover:text-bone"
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-bone transition-transform duration-500 ease-luxe group-hover:scale-x-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link href="/" className="text-[15px] md:text-[17px]" aria-label="BGOD — página inicial">
            <Logo />
          </Link>

          <div className="flex flex-1 items-center justify-end gap-1">
            <button
              type="button"
              className="p-2 text-bone/85 transition-colors hover:text-bone"
              aria-label="Buscar"
              onClick={() => setSearchOpen(true)}
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              className="relative -mr-2 p-2 text-bone/85 transition-colors hover:text-bone"
              aria-label={`Abrir sacola${count ? `, ${count} ${count === 1 ? "item" : "itens"}` : ""}`}
              onClick={() => setCartOpen(true)}
            >
              <BagIcon />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-bone px-1 text-[9px] font-semibold text-ink"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 top-16 z-40 overflow-y-auto bg-ink lg:hidden"
          >
            <nav aria-label="Menu mobile" className="px-gutter flex flex-col pb-12 pt-6">
              {[...nav, ...categories.slice(3).map((c) => ({ href: `/categoria/${c.slug}`, label: c.name }))].map(
                (item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link href={item.href} className="display block border-b hairline py-4 text-[2.4rem]">
                      {item.label}
                    </Link>
                  </motion.div>
                ),
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Buscar produtos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-ink/95 backdrop-blur-md"
          onClick={onClose}
        >
          <div className="px-gutter mx-auto max-w-5xl pt-[18vh]" onClick={(e) => e.stopPropagation()}>
            <form
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                const q = inputRef.current?.value.trim();
                onClose();
                router.push(q ? `/loja?q=${encodeURIComponent(q)}` : "/loja");
              }}
            >
              <label htmlFor="busca" className="eyebrow">
                Buscar na loja
              </label>
              <div className="mt-4 flex items-center gap-4 border-b border-bone/40 pb-3 focus-within:border-bone">
                <input
                  ref={inputRef}
                  id="busca"
                  name="q"
                  type="search"
                  placeholder="Jeans, moletom, boné…"
                  autoComplete="off"
                  className="display w-full bg-transparent text-[clamp(2rem,6vw,4.5rem)] placeholder:text-bone/20 focus:outline-none"
                />
                <button type="submit" className="p-2" aria-label="Buscar">
                  <SearchIcon width={28} height={28} />
                </button>
              </div>
            </form>
            <button type="button" onClick={onClose} className="eyebrow mt-8 hover:text-bone">
              Fechar — Esc
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
