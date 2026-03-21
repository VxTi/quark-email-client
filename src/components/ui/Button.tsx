import type React from "react";
import type { ComponentProps } from "react";

type Props = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
} & ComponentProps<"button">;

export default function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  className = "",
}: Props) {
  const base =
    "px-4 py-2 rounded-xl font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/80",
    ghost: "bg-transparent border border-border text-foreground hover:bg-background",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
