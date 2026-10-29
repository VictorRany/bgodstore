import Link from "next/link";

type Variant = "solid" | "outline" | "ghost";

interface Common {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = Common &
  (
    | ({ href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
    | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">)
  );

const styles: Record<Variant, string> = {
  solid: "bg-bone text-ink hover:bg-white",
  outline: "border border-bone/50 text-bone hover:border-bone hover:bg-bone hover:text-ink",
  ghost: "text-bone hover:text-white",
};

/** Botão com preenchimento que desliza no hover e leve compressão no clique. */
export function Button({ variant = "solid", className = "", children, ...props }: ButtonProps) {
  const cls = `group relative inline-flex h-12 items-center justify-center gap-3 overflow-hidden px-8 text-[11px] font-semibold uppercase tracking-[0.24em] transition-[background-color,color,border-color,transform] duration-500 ease-luxe active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${styles[variant]} ${className}`;
  const inner = (
    <span className="relative inline-flex items-center gap-3 transition-transform duration-500 ease-luxe group-hover:translate-x-0.5">
      {children}
    </span>
  );

  if (props.href !== undefined) {
    const { href, ...rest } = props;
    const external = /^https?:/.test(href);
    return external ? (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  const { href: _href, ...rest } = props;
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
