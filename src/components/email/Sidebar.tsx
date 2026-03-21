"use client";
import { useState } from "react";
import SidebarItem from "./SidebarItem";
import Button from "@/components/ui/Button";

const FOLDERS = ["Inbox", "Sent", "Drafts", "Trash"] as const;

export default function Sidebar() {
  const [active, setActive] = useState("Inbox");
  return (
    <aside className="w-52 h-full flex flex-col border-r border-border bg-card p-3 gap-1 shrink-0">
      <Button className="mb-3 w-full justify-center">Compose</Button>
      {FOLDERS.map((folder) => (
        <SidebarItem key={folder} label={folder} active={active === folder} onClick={() => setActive(folder)} />
      ))}
    </aside>
  );
}
