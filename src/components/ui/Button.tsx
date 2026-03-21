interface Props {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
}

export default function Button({ children, type = "button", onClick, variant = "primary", className = "" }: Props) {
  const base = "px-4 py-2 rounded-xl font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 cursor-pointer";
  const variants = {
    primary: "bg-accent text-white hover:bg-zinc-700",
    ghost: "bg-transparent border border-border text-text hover:bg-bg",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
