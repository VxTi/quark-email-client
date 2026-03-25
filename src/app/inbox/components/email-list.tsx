'use client';
import { Field } from '@base-ui/react/field';
import {
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEmails } from '@/lib/email-context';
import { useTags } from '@/lib/tag-context';
import type { ActiveFilter, Email, Tag } from '@/types/email';
import { EmailListProvider, useEmailList } from './email-list-context';
import EmailListItem from './email-list-item';

export const EMAIL_LIST_DEFAULT_WIDTH = 250;
export const EMAIL_LIST_MAX_WIDTH = 600;
const EMAIL_LIST_COLLAPSE_THRESHOLD = 180;

interface Props {
  emails: Email[];
  selectedId?: string;
  onSelect: (email: Email) => void;
  onDelete?: (ids: string[]) => void;
  filter?: ActiveFilter;
}

interface ResizableProps extends Props {
  width: number;
  onHandleMouseDown: (e: React.MouseEvent) => void;
  onCollapse: () => void;
}

function useDragListeners(
  dragging: React.RefObject<boolean>,
  startX: React.RefObject<number>,
  startWidth: React.RefObject<number>,
  setWidth: (w: number) => void
): void {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const next = Math.min(
        EMAIL_LIST_MAX_WIDTH,
        Math.max(0, startWidth.current + e.clientX - startX.current)
      );
      setWidth(next);
    };
    const onUp = () => {
      dragging.current = false;
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [dragging, startX, startWidth, setWidth]);
}

function useResizableWidth() {
  const [width, setWidth] = useState(EMAIL_LIST_DEFAULT_WIDTH);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  useDragListeners(dragging, startX, startWidth, setWidth);
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    e.preventDefault();
  };
  return {
    width,
    onMouseDown,
    collapsed: width < EMAIL_LIST_COLLAPSE_THRESHOLD,
    expand: () => {
      setWidth(EMAIL_LIST_DEFAULT_WIDTH);
    },
    collapse: () => {
      setWidth(0);
    },
  };
}

function ResizeHandle({
  onMouseDown,
}: {
  onMouseDown: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="hover:bg-border absolute top-0 right-0 z-10 h-full w-1 cursor-col-resize transition-colors"
    />
  );
}

function ExpansionButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="relative h-full w-0 shrink-0">
      <Button
        title="Expand"
        variant="ghost"
        size="icon"
        onClick={onClick}
        className="border-border bg-card hover:bg-accent absolute top-1/2 left-0 z-50 h-10 w-5 -translate-y-1/2 rounded-l-none rounded-r-md border-2 border-l-0"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function CollapseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onClick}
      title="Collapse"
      className="border-border bg-card hover:bg-accent absolute top-1/2 -right-0.5 h-10 w-5 -translate-y-1/2 rounded-l-md rounded-r-none border-2 border-r-0"
    >
      <ChevronLeft className="size-4" />
    </Button>
  );
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

function SearchBar() {
  const { query, setQuery, closeSearch } = useEmailList();
  return (
    <div className="border-border flex shrink-0 items-center gap-2 border-b-2 px-3 py-2">
      <Search className="text-muted-foreground size-4 shrink-0" />
      <Field.Root className="flex-1">
        <Field.Control
          render={
            <input
              placeholder="Search..."
              // biome-ignore lint/a11y/noAutofocus: It's fine
              autoFocus
              value={query}
              onChange={e => {
                setQuery(e.target.value);
              }}
            />
          }
          className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
        />
      </Field.Root>
      <Button variant="ghost" size="icon" onClick={closeSearch}>
        <X className="size-4" />
      </Button>
    </div>
  );
}

function HeaderActions() {
  const { selectMode, toggleSelect, selectedIds, deleteSelected, openSearch } =
    useEmailList();
  return (
    <div className="flex gap-0.5">
      <TooltipButton label="Search" onClick={openSearch}>
        <Search className="size-4" />
      </TooltipButton>
      <TooltipButton
        label="Select"
        onClick={toggleSelect}
        className={selectMode ? 'bg-accent' : ''}
        disabled={selectedIds.size === 0}
      >
        <CheckSquare className="size-4" />
      </TooltipButton>
      <TooltipButton
        label="Delete selected"
        onClick={deleteSelected}
        disabled={selectedIds.size === 0}
      >
        <Trash2 className="size-4" />
      </TooltipButton>
    </div>
  );
}

function EmailListHeader() {
  const { title } = useEmailList();
  return (
    <div className="border-border flex h-14 shrink-0 items-center justify-between border-b-2 px-4 py-2.5">
      <div className="min-w-0 flex-1">
        <h2 className="text-foreground truncate text-sm font-semibold">
          {title}
        </h2>
      </div>
      <HeaderActions />
    </div>
  );
}

function TagSubmenu({ email }: { email: Email }) {
  const { tags } = useTags();
  const { updateEmailTags } = useEmails();
  const available = tags.filter(
    t => !email.tags.some(et => et.name === t.name)
  );
  const addTag = (tag: Tag) => {
    updateEmailTags(email.id, [...email.tags, tag]);
  };
  return (
    <ContextMenuSub>
      <ContextMenuSubTrigger>Add Tag</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        {available.length === 0 && (
          <ContextMenuItem disabled>No tags available</ContextMenuItem>
        )}
        {available.map(tag => (
          <ContextMenuItem
            key={tag.name}
            onClick={() => {
              addTag(tag);
            }}
          >
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
        <ContextMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function EmailListBody() {
  const {
    filteredEmails,
    selectedId,
    onSelect,
    onDeleteEmails,
    selectMode,
    selectedIds,
    toggleId,
  } = useEmailList();
  return (
    <div className="flex-1 overflow-y-auto">
      {filteredEmails.map(e => (
        <EmailItemMenu
          key={e.id}
          email={e}
          onDelete={() => onDeleteEmails?.([e.id])}
        >
          <EmailListItem
            email={e}
            selected={e.id === selectedId}
            onClick={() => {
              onSelect(e);
            }}
            selectable={selectMode}
            checked={selectedIds.has(e.id)}
            onCheck={() => {
              toggleId(e.id);
            }}
          />
        </EmailItemMenu>
      ))}
      {filteredEmails.length === 0 && (
        <div className="text-muted-foreground mx-auto flex max-w-3/4 items-center justify-center pt-6 text-sm">
          It seems there are no emails to be found here.
        </div>
      )}
    </div>
  );
}

function EmailListContent({
  width,
  onHandleMouseDown,
  onCollapse,
}: {
  width: number;
  onHandleMouseDown: (e: React.MouseEvent) => void;
  onCollapse: () => void;
}) {
  const { searching } = useEmailList();
  return (
    <div
      className="border-border relative flex h-full shrink-0 flex-col border-r-2"
      style={{ width }}
    >
      <EmailListHeader />
      {searching && <SearchBar />}
      <EmailListBody />
      <ResizeHandle onMouseDown={onHandleMouseDown} />
      <CollapseButton onClick={onCollapse} />
    </div>
  );
}

function ResizableEmailList(props: ResizableProps) {
  const {
    emails,
    selectedId,
    onSelect,
    onDelete,
    filter,
    width,
    onHandleMouseDown,
    onCollapse,
  } = props;
  return (
    <EmailListProvider
      emails={emails}
      selectedId={selectedId}
      onSelect={onSelect}
      onDelete={onDelete}
      filter={filter}
    >
      <EmailListContent
        width={width}
        onHandleMouseDown={onHandleMouseDown}
        onCollapse={onCollapse}
      />
    </EmailListProvider>
  );
}

export default function EmailList(props: Props) {
  const { width, onMouseDown, collapsed, expand, collapse } =
    useResizableWidth();
  if (collapsed) {
    return <ExpansionButton onClick={expand} />;
  }
  return (
    <ResizableEmailList
      {...props}
      width={width}
      onHandleMouseDown={onMouseDown}
      onCollapse={collapse}
    />
  );
}
