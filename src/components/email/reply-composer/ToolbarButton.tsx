import { TooltipContent, TooltipRoot, TooltipTrigger } from "prosekit/react/tooltip";
import type { MouseEventHandler, ReactNode } from "react";

interface Props {
  pressed?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  tooltip?: string;
  children: ReactNode;
}

function TooltipLabel({ text }: { text: string }) {
  return (
    <TooltipContent className="z-50 rounded-md px-2.5 py-1 text-xs bg-primary text-primary-foreground shadow-sm [&:not([data-state])]:hidden will-change-transform motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:animate-duration-150 motion-safe:data-[state=closed]:animate-duration-200 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=top]:slide-in-from-bottom-2">
      {text}
    </TooltipContent>
  );
}

export default function ToolbarButton({ pressed, disabled, onClick, tooltip, children }: Props) {
  return (
    <TooltipRoot>
      <TooltipTrigger className="block">
        <button
          type="button"
          data-state={pressed ? "on" : "off"}
          disabled={disabled}
          onClick={onClick}
          onMouseDown={(e) => e.preventDefault()}
          className="flex items-center justify-center rounded p-1.5 text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-40 hover:bg-accent data-[state=on]:bg-border cursor-pointer"
        >
          {children}
          {tooltip ? <span className="sr-only">{tooltip}</span> : null}
        </button>
      </TooltipTrigger>
      {tooltip ? <TooltipLabel text={tooltip} /> : null}
    </TooltipRoot>
  );
}
