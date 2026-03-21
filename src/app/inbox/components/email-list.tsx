"use client";
import { Field } from "@base-ui/react/field";
import { CheckSquare, Search, Trash2, X } from "lucide-react";
import type React from "react";
import { useState } from "react";
import Button from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Email } from "@/types/email";
import EmailListItem from "./email-list-item";

interface Props {
  emails: Email[];
  selectedId?: string;
  onSelect: (email: Email) => void;
  onDelete?: (ids: string[]) => void;
}

interface SearchBarProps {
  query: string;
  onChange: (q: string) => void;
  onClose: () => void;
}

interface TooltipButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

interface HeaderActionsProps {
  selectMode: boolean;
  canDelete: boolean;
  onToggleSelect: () => void;
  onDelete: () => void;
  onSearch: () => void;
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

function TooltipButton({ label, onClick, disabled, className, children }: TooltipButtonProps) {
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
              // biome-ignore lint/a11y/noAutofocus: It's fine
              autoFocus
              value={query}
              onChange={(e) => onChange(e.target.value)}
            />
          }
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
}: HeaderActionsProps) {
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

function EmailListHeader(props: HeaderActionsProps) {
  return (
    <div className="px-4 py-2.5 border-b border-border shrink-0 flex items-center justify-between">
      <h2 className="font-semibold text-foreground text-sm">Inbox</h2>
      <HeaderActions {...props} />
    </div>
  );
}

export default function EmailList({ emails, selectedId, onSelect, onDelete }: Props) {
  const {
    selectMode,
    toggleSelect,
    exitSelect,
    selectedIds,
    toggleId,
    searching,
    setSearching,
    query,
    setQuery,
  } = useEmailListState();
  const filtered = emails.filter(
    (e) =>
      !query || `${e.from} ${e.subject} ${e.preview}`.toLowerCase().includes(query.toLowerCase()),
  );
  const headerProps = {
    selectMode,
    canDelete: selectedIds.size > 0,
    onToggleSelect: toggleSelect,
    onDelete: () => {
      onDelete?.([...selectedIds]);
      exitSelect();
    },
    onSearch: () => setSearching(true),
  };
  return (
    <div className="w-80 h-full flex flex-col border-r border-border shrink-0">
      <EmailListHeader {...headerProps} />
      {searching && (
        <SearchBar
          query={query}
          onChange={setQuery}
          onClose={() => {
            setSearching(false);
            setQuery("");
          }}
        />
      )}
      <div className="overflow-y-auto flex-1">
        {filtered.map((e) => (
          <EmailListItem
            key={e.id}
            email={e}
            selected={e.id === selectedId}
            onClick={() => onSelect(e)}
            selectable={selectMode}
            checked={selectedIds.has(e.id)}
            onCheck={() => toggleId(e.id)}
          />
        ))}
      </div>
    </div>
  );
}
