"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "loading" | "ok" | "error";

export function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "ok" : "error");
      if (res.ok) form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section aria-labelledby="news-titulo" className="px-gutter mx-auto max-w-[1600px] py-24">
      <div className="grid gap-10 border-t hairline pt-16 md:grid-cols-2">
        <h2 id="news-titulo" className="font-serif text-[clamp(2rem,4vw,3.6rem)] leading-tight">
          Primeiro acesso aos <em className="text-silver">lançamentos</em>.
        </h2>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 self-end">
          <label htmlFor="news-email" className="eyebrow">
            Seu e-mail
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="news-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="nome@email.com"
              className="h-12 flex-1 border-b border-bone/30 bg-transparent text-lg placeholder:text-bone/25 focus:border-bone focus:outline-none"
            />
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Enviando…" : "Assinar"}
            </Button>
          </div>
          <p role="status" className="min-h-5 text-xs text-silver">
            {status === "ok" && "Pronto. Você vai receber as novidades por e-mail."}
            {status === "error" && "Não foi possível cadastrar agora. Tente novamente em instantes."}
          </p>
        </form>
      </div>
    </section>
  );
}
