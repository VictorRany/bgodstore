import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { InstagramIcon, WhatsappIcon } from "@/components/ui/icons";
import { categories } from "@/data/categories";
import { policies } from "@/data/policies";
import { site, whatsappLink } from "@/data/site";

export function Footer() {
  const wa = whatsappLink("Olá, BGOD! Vim pelo site.");
  const year = new Date().getFullYear();

  return (
    <footer className="grain relative mt-32 border-t hairline bg-ink">
      <div className="px-gutter mx-auto max-w-[1600px] pt-20">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="full" className="-ml-3 w-32" />
            <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-bone/80">
              {site.tagline}. {site.city} — {site.state}.
            </p>
            <ul className="mt-6 space-y-1 text-sm text-silver">
              <li>{site.shipping}</li>
              <li>{site.service}</li>
            </ul>
          </div>

          <FooterCol title="Loja">
            <FooterLink href="/loja">Todos os produtos</FooterLink>
            <FooterLink href="/loja?sort=novidades">Lançamentos</FooterLink>
            {categories.map((c) => (
              <FooterLink key={c.slug} href={`/categoria/${c.slug}`}>
                {c.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Ajuda">
            {policies.map((p) => (
              <FooterLink key={p.slug} href={`/politicas/${p.slug}`}>
                {p.title}
              </FooterLink>
            ))}
            <FooterLink href="/carrinho">Sacola</FooterLink>
          </FooterCol>

          <FooterCol title="Atendimento">
            {wa && (
              <li>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-bone/80 hover:text-bone">
                  <WhatsappIcon width={16} height={16} /> WhatsApp
                </a>
              </li>
            )}
            <li>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-bone/80 hover:text-bone"
              >
                <InstagramIcon width={16} height={16} /> {site.instagram.handle}
              </a>
            </li>
            {site.email && <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>}
          </FooterCol>
        </div>

        <div aria-hidden className="display mt-24 select-none overflow-hidden text-[21vw] leading-[0.78] text-bone/[0.04]">
          B-GOD
        </div>

        <div className="flex flex-col gap-3 border-t hairline py-6 text-[11px] text-steel md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legal.companyName ?? site.name}
            {site.legal.cnpj && ` · CNPJ ${site.legal.cnpj}`}
            {site.legal.address && ` · ${site.legal.address}`}
          </p>
          <p>
            {site.city} · {site.state} · {site.country}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="md:col-span-2 md:col-start-auto [&:nth-child(2)]:md:col-start-7">
      <h2 className="eyebrow">{title}</h2>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-bone/80 transition-colors hover:text-bone">
        {children}
      </Link>
    </li>
  );
}
