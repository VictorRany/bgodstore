import { site } from "@/data/site";

const items = [site.tagline, site.shipping, site.service, `${site.city} — ${site.state}`];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y hairline py-5" aria-label={items.join(" · ")}>
      <div aria-hidden className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((text, i) => (
              <span key={i} className="flex items-center gap-10 pr-10 text-[11px] uppercase tracking-[0.32em] text-silver">
                {text}
                <span className="inline-block h-1 w-1 rotate-45 bg-silver/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
