"use client";

import { useEffect, useState } from "react";

/** Evita divergência de hidratação ao ler estado persistido no navegador (ex.: carrinho). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
