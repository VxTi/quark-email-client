'use client';

import { createContext, useContext, useState } from 'react';
import type { ActiveFilter, Email, InternalTag } from '@/types/email';

interface EmailListContextType {
  emails: Email[];
  filteredEmails: Email[];
  selectedId?: string;
  onSelect: (email: Email) => void;
  onDeleteEmails?: (ids: string[]) => void;
  title: string;
  selectMode: boolean;
  toggleSelect: () => void;
  selectedIds: Set<string>;
  toggleId: (id: string) => void;
  deleteSelected: () => void;
  searching: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  query: string;
  setQuery: (q: string) => void;
}

const EmailListContext = createContext<EmailListContextType | undefined>(
  undefined
);

const MAILBOX_LABELS: Record<InternalTag, string> = {
  inbox: 'Inbox',
  sent: 'Sent',
  draft: 'Drafts',
  trash: 'Trash',
};

function filterTitle(filter: ActiveFilter): string {
  if (!filter) {
    return 'Inbox';
  }

  if (filter.kind === 'mailbox') {
    return MAILBOX_LABELS[filter.value];
  }

  return filter.value;
}

function applyFilters(
  emails: Email[],
  filter: ActiveFilter,
  query: string
): Email[] {
  let result = emails;
  if (filter?.kind === 'mailbox') {
    result = result.filter(e => e.internalTag === filter.value);
  }
  if (filter?.kind === 'tag') {
    result = result.filter(e => e.tags.some(t => t.name === filter.value));
  }
  if (query) {
    result = result.filter(e =>
      `${e.from} ${e.subject} ${e.preview}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }
  return result;
}

interface ProviderProps {
  emails: Email[];
  selectedId?: string;
  onSelect: (email: Email) => void;
  onDelete?: (ids: string[]) => void;
  filter?: ActiveFilter;
  children: React.ReactNode;
}

export function EmailListProvider({
  children,
  emails,
  selectedId,
  onSelect,
  onDelete,
  filter,
}: ProviderProps) {
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set<string>());
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');

  const resolvedFilter = filter ?? null;

  const exitSelect = () => {
    setSelectMode(false);
    setSelectedIds(new Set());
  };

  const toggleId = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelect = () => {
    if (selectMode) {
      exitSelect();
    } else {
      setSelectMode(true);
    }
  };

  return (
    <EmailListContext.Provider
      value={{
        emails,
        filteredEmails: applyFilters(emails, resolvedFilter, query),
        selectedId,
        onSelect,
        onDeleteEmails: onDelete,
        title: filterTitle(resolvedFilter),
        selectMode,
        toggleSelect,
        selectedIds,
        toggleId,
        deleteSelected: () => {
          onDelete?.([...selectedIds]);
          exitSelect();
        },
        searching,
        openSearch: () => {
          setSearching(true);
        },
        closeSearch: () => {
          setSearching(false);
          setQuery('');
        },
        query,
        setQuery,
      }}
    >
      {children}
    </EmailListContext.Provider>
  );
}

export function useEmailList() {
  const ctx = useContext(EmailListContext);
  if (!ctx)
    throw new Error('useEmailList must be used within EmailListProvider');
  return ctx;
}
