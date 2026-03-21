"use client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/button";
import { useTags } from "@/lib/tag-context";
import CreateTagDialog from "./create-tag-dialog";
import SidebarItem from "./sidebar-item";
import SidebarSectionTitle from "./sidebar-section-title";

export default function TagSection() {
  const { tags, createTag } = useTags();
  const [open, setOpen] = useState(false);
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-1 mt-4">
      <div className="flex items-center justify-between px-3">
        <SidebarSectionTitle title="Labels" />
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <PlusIcon className="size-3" />
        </Button>
      </div>
      {sortedTags.map((tag) => (
        <SidebarItem key={tag.name} color={tag.color} text={tag.name} onClick={() => {}} />
      ))}
      <CreateTagDialog open={open} onOpenChange={setOpen} onCreate={createTag} />
    </div>
  );
}
