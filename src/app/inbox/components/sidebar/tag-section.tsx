"use client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTags } from "@/lib/tag-context";
import CreateTagForm from "./create-tag-dialog";
import SidebarItem from "./sidebar-item";
import SidebarSectionTitle from "./sidebar-section-title";

function TagHeader({ onCreate }: { onCreate: (name: string, color: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between px-3">
      <SidebarSectionTitle title="Tags" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <PlusIcon className="size-3" />
        </PopoverTrigger>
        <PopoverContent side="right" align="start" className="w-80">
          <CreateTagForm onCreate={onCreate} onClose={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function TagSection() {
  const { tags, createTag } = useTags();
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="flex flex-col gap-1 mt-4">
      <TagHeader onCreate={createTag} />
      {sortedTags.map((tag) => (
        <SidebarItem key={tag.name} color={tag.color} text={tag.name} onClick={() => {}} />
      ))}
    </div>
  );
}
