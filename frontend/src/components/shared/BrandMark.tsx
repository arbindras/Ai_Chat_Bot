// A small inline SVG mark used as the app's logo/favicon motif — avoids
// depending on any third-party logo image (the old app used OpenAI's own
// logo mark, which isn't really this app's brand to use) and keeps the
// bundle free of raster images entirely.
const BrandMark = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <defs>
      <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7C8CFF" />
        <stop offset="1" stopColor="#4C5CD6" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#brandGradient)" />
    <path
      d="M18 24a8 8 0 0 1 8-8h12a8 8 0 0 1 8 8v8a8 8 0 0 1-8 8H28l-8 6v-6a8 8 0 0 1-2-1.5V24z"
      fill="#fff"
      opacity="0.95"
    />
    <circle cx="26" cy="28" r="2.4" fill="#4C5CD6" />
    <circle cx="32" cy="28" r="2.4" fill="#4C5CD6" />
    <circle cx="38" cy="28" r="2.4" fill="#4C5CD6" />
  </svg>
);

export default BrandMark;
