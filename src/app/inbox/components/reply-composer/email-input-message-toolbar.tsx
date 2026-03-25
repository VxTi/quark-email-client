'use client';
import type { LucideIcon } from 'lucide-react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Redo2,
  Underline,
  Undo2,
} from 'lucide-react';
import type { BasicExtension } from 'prosekit/basic';
import type { Editor } from 'prosekit/core';
import { useEditorDerivedValue } from 'prosekit/react';
import EmailInputToolbarButton   from './email-input-toolbar-button';

type Ed = Editor<BasicExtension>;
interface ToolItem {
  label: string;
  Icon: LucideIcon;
  active: boolean;
  can: boolean;
  exec: () => void;
}

function mk(
  label: string,
  Icon: LucideIcon,
  active: boolean,
  can: boolean,
  exec: () => void
): ToolItem {
  return { label, Icon, active, can, exec };
}

const undoItem = (e: Ed) =>
  mk('Undo', Undo2, false, e.commands.undo.canExec(), () => e.commands.undo());

const redoItem = (e: Ed) =>
  mk('Redo', Redo2, false, e.commands.redo.canExec(), () => e.commands.redo());

const boldItem = (e: Ed) =>
  mk(
    'Bold',
    Bold,
    e.marks.bold.isActive(),
    e.commands.toggleBold.canExec(),
    () => e.commands.toggleBold()
  );

const italicItem = (e: Ed) =>
  mk(
    'Italic',
    Italic,
    e.marks.italic.isActive(),
    e.commands.toggleItalic.canExec(),
    () => e.commands.toggleItalic()
  );

const underlineItem = (e: Ed) =>
  mk(
    'Underline',
    Underline,
    e.marks.underline.isActive(),
    e.commands.toggleUnderline.canExec(),
    () => e.commands.toggleUnderline()
  );

const bulletItem = (e: Ed) =>
  mk(
    'Bullet List',
    List,
    e.nodes.list.isActive({ kind: 'bullet' }),
    e.commands.toggleList.canExec({ kind: 'bullet' }),
    () => e.commands.toggleList({ kind: 'bullet' })
  );

const orderedItem = (e: Ed) =>
  mk(
    'Ordered List',
    ListOrdered,
    e.nodes.list.isActive({ kind: 'ordered' }),
    e.commands.toggleList.canExec({ kind: 'ordered' }),
    () => e.commands.toggleList({ kind: 'ordered' })
  );

function getItems(e: Ed): ToolItem[] {
  return [
    undoItem(e),
    redoItem(e),
    boldItem(e),
    italicItem(e),
    underlineItem(e),
    bulletItem(e),
    orderedItem(e),
  ];
}

function ToolbarItem({ item }: { item: ToolItem }) {
  return (
    <EmailInputToolbarButton
      pressed={item.active}
      disabled={!item.can}
      onClick={item.exec}
      tooltip={item.label}
    >
      <item.Icon size={20} />
    </EmailInputToolbarButton>
  );
}

export default function EmailInputMessageToolbar() {
  const items = useEditorDerivedValue(getItems);
  return (
    <div className="border-border flex flex-wrap gap-0.5 border-b px-2 py-1.5">
      {items.map(item => (
        <ToolbarItem key={item.label} item={item} />
      ))}
    </div>
  );
}
