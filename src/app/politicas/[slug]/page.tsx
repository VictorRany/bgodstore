import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { policies } from "@/data/policies";
import { site, whatsappLink } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const policy = policies.find((p) => p.slug === slug);
  return policy ? { title: policy.title, description: policy.summary } : {};
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;
  const policy = policies.find((p) => p.slug === slug);
  if (!policy) notFound();
  const contact = whatsappLink(`Olá, BGOD! Tenho uma dúvida sobre ${policy.title.toLowerCase()}.`) ?? site.instagram.url;

  return (
    <div className="px-gutter mx-auto max-w-[1600px]">
      <PageHeader crumbs={[{ href: "/", label: "Início" }, { label: "Ajuda" }, { label: policy.title }]} title={policy.title} />
      <div className="grid gap-12 md:grid-cols-12">
        <nav aria-label="Políticas" className="md:col-span-3">
          <ul className="space-y-3 border-l hairline pl-5">
            {policies.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/politicas/${p.slug}`}
                  aria-current={p.slug === slug ? "page" : undefined}
                  className={`text-sm ${p.slug === slug ? "text-bone" : "text-silver hover:text-bone"}`}
                >
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <article className="max-w-2xl space-y-6 leading-relaxed text-bone/80 md:col-span-8 md:col-start-5">
          {policy.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {policy.pending && (
            <p className="border hairline p-5 text-sm text-silver">
              As informações completas desta política estão sendo preparadas. Para dúvidas, fale com o{" "}
              <a href={contact} target="_blank" rel="noopener noreferrer" className="text-bone underline underline-offset-4">
                atendimento da BGOD
              </a>
              .
            </p>
          )}
        </article>
      </div>
    </div>
  );
}
