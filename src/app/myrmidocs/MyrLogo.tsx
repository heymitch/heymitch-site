// Myrmidocs mark. Uses currentColor so it recolors to teal / ink / paper via
// the surrounding text color. Source: docs/superpowers/design/myrmidocs-brand/myr-logo.svg
export default function MyrLogo({
  className,
  title = "Myrmidocs",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      role="img"
      aria-label={title}
      className={className}
    >
      <g fill="currentColor">
        <circle cx="92" cy="96" r="11" />
        <circle cx="92" cy="127" r="11" />
        <ellipse cx="92" cy="162" rx="12" ry="17.4" />
      </g>
      <path
        d="M124 92 Q156 116 150 150 L188 92 L188 168"
        fill="none"
        stroke="currentColor"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
