import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Encaminha o e-mail para o webhook configurado (Brevo, Mailchimp, Zapier, Make…). */
export async function POST(request: Request) {
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ error: "Newsletter não configurada." }, { status: 501 });

  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
  if (typeof email !== "string" || email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source: "site-bgod" }),
  }).catch(() => null);

  if (!res?.ok) return NextResponse.json({ error: "Falha ao cadastrar." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
