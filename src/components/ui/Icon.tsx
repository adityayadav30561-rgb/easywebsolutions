import type { SVGProps } from "react";

/**
 * Minimal line-icon set (24px grid, 1.6 stroke). Inline SVG keeps the bundle
 * small and avoids an icon-library dependency.
 */
const paths = {
  "arrow-right": <path d="M5 12h14m-5-5 5 5-5 5" />,
  "arrow-up-right": <path d="M7 17 17 7M8 7h9v9" />,
  "arrow-left": <path d="M19 12H5m5 5-5-5 5-5" />,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  minus: <path d="M6 12h12" />,
  plus: <path d="M12 5v14M5 12h14" />,
  menu: <path d="M4 8h16M4 16h16" />,
  sparkle: (
    <path d="M12 3.5c.5 3.9 2.6 6 6.5 6.5-3.9.5-6 2.6-6.5 6.5-.5-3.9-2.6-6-6.5-6.5 3.9-.5 6-2.6 6.5-6.5ZM18.5 15.5c.2 1.6 1 2.4 2.5 2.5-1.5.2-2.3 1-2.5 2.5-.2-1.5-1-2.3-2.5-2.5 1.5-.1 2.3-.9 2.5-2.5Z" />
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </>
  ),
  zap: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6L13 3Z" />,
  lifebuoy: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="m6 6 3.5 3.5M14.5 14.5 18 18M18 6l-3.5 3.5M9.5 14.5 6 18" />
    </>
  ),
  shield: <path d="M12 3.5 5 6v5.5c0 4.3 3 7.9 7 9 4-1.1 7-4.7 7-9V6l-7-2.5Zm-3 8.8 2.2 2.2L15.5 10" />,
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6M5 12v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" />
    </>
  ),
  refresh: <path d="M19.5 12a7.5 7.5 0 0 1-13.1 5M4.5 12a7.5 7.5 0 0 1 13.1-5M17.5 3.5V7h-3.5M6.5 20.5V17H10" />,
  gauge: (
    <>
      <path d="M4.2 16.5a8.5 8.5 0 1 1 15.6 0" />
      <path d="m12 13 3.5-4" />
      <circle cx="12" cy="13.5" r="1.2" />
    </>
  ),
  activity: <path d="M3.5 12h4l2.5-6 4 12 2.5-6h4" />,
  pen: <path d="M4.5 19.5 5.5 15 15.8 4.7a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8L9 18.5l-4.5 1ZM13.5 7l3.5 3.5" />,
  phone: (
    <path d="M6.6 3.8 9 3.5l1.6 4-2 1.3a11 11 0 0 0 6.6 6.6l1.3-2 4 1.6-.3 2.4a2 2 0 0 1-2 1.7A15.5 15.5 0 0 1 4.9 5.8a2 2 0 0 1 1.7-2Z" />
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M4 20l1.2-4A8.3 8.3 0 1 1 8 18.9L4 20Z" />
      <path d="M9.2 8.5c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.5.9 1.4 1.8 2.4 2.3.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.3.3.5 0 .6-.2 1.2-.7 1.5-.6.4-1.5.5-2.6.1-1.7-.6-3.4-2-4.3-3.6-.6-1.1-.9-2.4-.2-3.8Z" />
    </>
  ),
  "map-pin": (
    <>
      <path d="M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 1 1 13 0c0 5.6-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </>
  ),
  chart: <path d="M4 20V4m0 16h16M8 16v-4m4 4V8m4 8v-6" />,
  radar: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 12 18 6M12 7.5a4.5 4.5 0 1 0 4.5 4.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
    </>
  ),
  share: (
    <>
      <circle cx="6.5" cy="12" r="2.5" />
      <circle cx="17.5" cy="6" r="2.5" />
      <circle cx="17.5" cy="18" r="2.5" />
      <path d="m8.8 10.8 6.4-3.6M8.8 13.2l6.4 3.6" />
    </>
  ),
  cursor: <path d="m5 4 5.5 15 2.2-6.3L19 10.5 5 4Zm7.7 8.7L18 18" />,
  devices: (
    <>
      <rect x="3" y="5" width="13" height="10" rx="1.8" />
      <path d="M6.5 19H13" />
      <rect x="16.5" y="9" width="4.5" height="10" rx="1.2" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.2a5.5 5.5 0 0 1 3 4.8" />
    </>
  ),
  code: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.4 2.4 4.6-4.8" />
    </>
  ),
  rocket: (
    <path d="M14.5 4.5c2.6-.9 4.4-1 5-.9.1.6 0 2.4-.9 5-1 2.8-3.3 5.3-6.1 6.9l-3-3c1.6-2.8 4.1-5.1 5-5.4ZM9.5 12.5 6 12l2.5-3.5h3.5M11.5 14.5l.5 3.5 3.5-2.5v-3.5M7 17c-1 .5-1.8 1.7-2 3 1.3-.2 2.5-1 3-2" />
  ),
  layers: <path d="m12 4 8.5 4.5L12 13 3.5 8.5 12 4Zm-8.5 8L12 16.5 20.5 12M3.5 15.5 12 20l8.5-4.5" />,
  quote: (
    <path
      d="M5 17.5c0-4.2 1.3-7.4 4.5-9.5l1 1.4C8.6 10.9 7.8 12.5 7.7 14H10v5H5v-1.5Zm8.5 0c0-4.2 1.3-7.4 4.5-9.5l1 1.4c-1.9 1.5-2.7 3.1-2.8 4.6h2.3v5h-5v-1.5Z"
      fill="currentColor"
      stroke="none"
    />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.9" cy="7.1" r="0.6" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16" />
    </>
  ),
  facebook: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <path d="M14.5 8H13a1.8 1.8 0 0 0-1.8 1.8V20M9.5 12.5h5" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number };

export function Icon({ name, size = 20, strokeWidth = 1.6, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
