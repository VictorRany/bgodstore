type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "square" as const,
  "aria-hidden": true,
};

export const SearchIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" />
  </svg>
);

export const BagIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 8h16l-1.2 13H5.2z" />
    <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" />
  </svg>
);

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 8h18M3 16h18" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
);

export const ArrowIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const MinusIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 12h14" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const WhatsappIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.3-4A8 8 0 1 1 8.4 19z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" />
  </svg>
);
