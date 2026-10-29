import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

export function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  href,
  linkLabel = "Ver todos",
}: {
  index?: string;
  eyebrow: string;
  title: string;
  accent?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <Reveal className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="eyebrow mb-4 flex items-center gap-3">
          {index && <span className="text-bone">{index}</span>}
          <span className="h-px w-8 bg-silver/40" />
          {eyebrow}
        </p>
        <h2 className="display text-[clamp(2.4rem,6.5vw,6rem)]">
          {title}
          {accent && (
            <span className="font-serif text-[0.55em] font-normal normal-case italic tracking-normal text-silver"> {accent}</span>
          )}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-3 self-start text-[11px] uppercase tracking-[0.24em] text-bone/80 hover:text-bone md:self-auto"
        >
          {linkLabel}
          <ArrowIcon width={16} height={16} className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
