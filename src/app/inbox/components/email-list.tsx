"use client";
import { Field } from "@base-ui/react/field";
import { CheckSquare, Search, Trash2, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import Button from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useEmails } from "@/lib/email-context";
import { useTags } from "@/lib/tag-context";
import { InternalTag, type ActiveFilter, type Email, type Tag } from "@/types/email";
import EmailListItem from "./email-list-item";

interface Props {
  emails: Email[];
  selectedId?: string;
  onSelect: (email: Email) => void;
  onDelete?: (ids: string[]) => void;
  filter?: ActiveFilter;
}

interface SearchBarProps {
  query: string;
  onChange: (q: string) => void;
  onClose: () => void;
}

interface ActionBarProps {
  selectMode: boolean;
  canDelete: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
  onSearch: () => void;
}

interface HeaderProps extends ActionBarProps {
  title: string;
}

interface BodyProps {
  emails: Email[];
  selectedId?: string;
  onSelect: (email: Email) => void;
  onDelete?: (ids: string[]) => void;
  selectMode: boolean;
  selectedIds: Set<string>;
  toggleId: (id: string) => void;
}

const MAILBOX_LABELS: Record<InternalTag, string> = {
  [InternalTag.Inbox]: "Inbox",
  [InternalTag.Sent]: "Sent",
  [InternalTag.Draft]: "Drafts",
  [InternalTag.Trash]: "Trash",
};

function filterTitle(filter: ActiveFilter): string {
  if (!filter) return "Inbox";
  if (filter.kind === "mailbox") return MAILBOX_LABELS[filter.value];
  return filter.value;
}

function applyFilters(emails: Email[], filter: ActiveFilter, query: string): Email[] {
  let result = emails;
  if (filter?.kind === "mailbox") result = result.filter((e) => e.internalTag === filter.value);
  if (filter?.kind === "tag")
    result = result.filter((e) => e.tags.some((t) => t.name === filter.value));
  if (query)
    result = result.filter((e) =>
      `${e.from} ${e.subject} ${e.preview}`.toLowerCase().includes(query.toLowerCase()),
    );
  return result;
}

function useEmailListState() {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set<string>());
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const toggleId = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const exitSelect = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };
  const toggleSelect = () => (selectMode ? exitSelect() : setSelectMode(true));
  return {
    selectMode,
    toggleSelect,
    exitSelect,
    selectedIds,
    toggleId,
    searching,
    setSearching,
    query,
    setQuery,
  };
}

function useHeaderProps(
  state: ReturnType<typeof useEmailListState>,
  onDelete: ((ids: string[]) => void) | undefined,
  filter: ActiveFilter,
) {
  return {
    title: filterTitle(filter ?? null),
    selectMode: state.selectMode,
    canDelete: state.selectedIds.size > 0,
    onToggleSelect: state.toggleSelect,
    onDelete: () => {
      onDelete?.([...state.selectedIds]);
      state.exitSelect();
    },
    onSearch: () => state.setSearching(true),
  };
}

function TooltipButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            onClick={onClick}
            disabled={disabled}
            className={className}
          >
            {children}
          </Button>
        }
      />
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

function SearchBar({ query, onChange, onClose }: SearchBarProps) {
  return (
    <div className="px-3 py-2 border-b border-border flex items-center gap-2 shrink-0">
      <Search className="size-4 text-muted-foreground shrink-0" />
      <Field.Root className="flex-1">
        <Field.Control
          render={
            <input
              placeholder="Search..."
              autoFocus
              value={query}
              onChange={(e) => onChange(e.target.value)}
            />
          } // biome-ignore lint/a11y/noAutofocus: It's fine
          className="w-full bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
        />
      </Field.Root>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="size-4" />
      </Button>
    </div>
  );
}

function HeaderActions({
  selectMode,
  canDelete,
  onToggleSelect,
  onDelete,
  onSearch,
}: ActionBarProps) {
  return (
    <div className="flex gap-0.5">
      <TooltipButton label="Search" onClick={onSearch}>
        <Search className="size-4" />
      </TooltipButton>
      <TooltipButton
        label="Select"
        onClick={onToggleSelect}
        className={selectMode ? "bg-accent" : ""}
      >
        <CheckSquare className="size-4" />
      </TooltipButton>
      <TooltipButton label="Delete selected" onClick={onDelete} disabled={!canDelete}>
        <Trash2 className="size-4" />
      </TooltipButton>
    </div>
  );
}

function EmailListHeader({ title, ...actions }: HeaderProps) {
  return (
    <div className="px-4 py-2.5 border-b border-border shrink-0 flex items-center justify-between">
      <h2 className="font-semibold text-foreground text-sm">{title}</h2>
      <HeaderActions {...actions} />
    </div>
  );
}

function TagSubmenu({ email }: { email: Email }) {
  const { tags } = useTags();
  const { updateEmailTags } = useEmails();
  const available = tags.filter((t) => !email.tags.some((et) => et.name === t.name));
  const addTag = (tag: Tag) => updateEmailTags(email.id, [...email.tags, tag]);
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Add Tag</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {available.length === 0 && <ContextMenuItem disabled>No tags available</ContextMenuItem>}
        {available.map((tag) => (
          <ContextMenuItem key={tag.name} onClick={() => addTag(tag)}>
            {tag.name}
          </ContextMenuItem>
        ))}
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
}

function EmailItemMenu({
  email,
  onDelete,
  children,
}: {
  email: Email;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <TagSubmenu email={email} />
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function EmailListBody({
  emails,
  selectedId,
  onSelect,
  onDelete,
  selectMode,
  selectedIds,
  toggleId,
}: BodyProps) {
  return (
    <div className="overflow-y-auto flex-1">
      {emails.map((e) => (
        <EmailItemMenu key={e.id} email={e} onDelete={() => onDelete?.([e.id])}>
          <EmailListItem
            email={e}
            selected={e.id === selectedId}
            onClick={() => onSelect(e)}
            selectable={selectMode}
            checked={selectedIds.has(e.id)}
            onCheck={() => toggleId(e.id)}
          />
        </EmailItemMenu>
      ))}
    </div>
  );
}

export default function EmailList({
  emails,
  selectedId,
  onSelect,
  onDelete,
  filter = null,
}: Props) {
  const state = useEmailListState();
  const filtered = applyFilters(emails, filter ?? null, state.query);
  const headerProps = useHeaderProps(state, onDelete, filter ?? null);
  const closeSearch = () => {
    state.setSearching(false);
    state.setQuery("");
  };
  return (
    <div className="w-80 h-full flex flex-col border-r border-border shrink-0">
      <EmailListHeader {...headerProps} />
      {state.searching && (
        <SearchBar query={state.query} onChange={state.setQuery} onClose={closeSearch} />
      )}
      <EmailListBody
        emails={filtered}
        selectedId={selectedId}
        onSelect={onSelect}
        onDelete={onDelete}
        selectMode={state.selectMode}
        selectedIds={state.selectedIds}
        toggleId={state.toggleId}
      />
    </div>
  );
}
