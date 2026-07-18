interface LogoMarkProps {
  size?: number;
}

export default function LogoMark({ size = 28 }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hm-grad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#hm-grad)" />
      {/* Bold H mark */}
      <path
        d="M8 8v12M20 8v12M8 14h12"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
