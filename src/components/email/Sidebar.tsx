"use client";
import Button from "@/components/ui/Button";
import { MessageCircleIcon, PanelLeftIcon, PanelRightIcon, PenLineIcon } from "lucide-react";
import React, { useState }                                               from "react";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const ExpansionIcon = expanded ? PanelLeftIcon : PanelRightIcon;

  return (
    <aside
      className="h-full flex flex-col border-r border-border bg-card p-3 gap-1 shrink-0"
      data-expanded={expanded}
    >
      <Button variant="ghost" className='justify-start max-w-max' onClick={() => setExpanded(!expanded)} >
        <ExpansionIcon />
      </Button>
      <SidebarItem icon={<MessageCircleIcon />} text="Messages" onClick={() => {}} />
      <SidebarItem icon={<PenLineIcon />} text="Compose" onClick={() => {}} />
    </aside>
  );
}

function SidebarItem({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="sidebar-text whitespace-nowrap overflow-hidden opacity-0 w-0 transition-all [aside[data-expanded='true']_&]:opacity-100 [aside[data-expanded='true']_&]:w-auto">
          {text}
        </span>
      </div>
    </Button>
  );
}
