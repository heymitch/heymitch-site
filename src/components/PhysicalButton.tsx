"use client";

interface PhysicalButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "red";
  className?: string;
}

export default function PhysicalButton({
  children,
  href,
  variant = "primary",
  className = "",
}: PhysicalButtonProps) {
  const isExternal = href?.startsWith("http");
  const Tag = href ? "a" : "button";

  return (
    <Tag
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`physical-btn physical-btn-${variant} ${className}`}
    >
      <span className="physical-btn-shadow" />
      <span className="physical-btn-edge" />
      <span className="physical-btn-front">{children}</span>
    </Tag>
  );
}
