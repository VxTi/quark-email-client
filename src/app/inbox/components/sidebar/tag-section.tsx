"use client";
import SidebarSection from "@/app/inbox/components/sidebar/sidebar-section";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTags } from "@/lib/tag-context";
import type { ActiveFilter } from "@/types/email";
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
        <PopoverContent
          side="right"
          align="start"
          className="w-80"
          render={
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              style={{ transformOrigin: "top left" }}
            >
              <CreateTagForm onCreate={onCreate} onClose={() => setOpen(false)} />
            </motion.div>
          }
        ></PopoverContent>
      </Popover>
    </div>
  );
}

interface Props {
  filter: ActiveFilter;
  onFilter: (filter: ActiveFilter) => void;
}

export default function TagSection({ filter, onFilter }: Props) {
  const { tags, createTag } = useTags();
  const sortedTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));
  const handleFilter = (value: string) =>
    onFilter(filter?.kind === "tag" && filter.value === value ? null : { kind: "tag", value });
  return (
    <SidebarSection>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <TagHeader onCreate={createTag} />
      {sortedTags.map((tag) => (
        <SidebarItem
          key={tag.name}
          color={tag.color}
          text={tag.name}
          active={filter?.kind === "tag" && filter.value === tag.name}
          onClick={() => handleFilter(tag.name)}
        />
      ))}
    </SidebarSection>
  );
}
