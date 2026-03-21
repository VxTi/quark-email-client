import type { Uploader } from "prosekit/extensions/file";
import type { ImageExtension } from "prosekit/extensions/image";
import { useEditor } from "prosekit/react";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "prosekit/react/popover";
import { type ReactNode, useId, useState } from "react";
import Button from "@/components/ui/Button";
import ToolbarButton from "./ToolbarButton";

interface Props {
  uploader: Uploader<string>;
  tooltip: string;
  disabled: boolean;
  children: ReactNode;
}

function useImageUpload(uploader: Uploader<string>, setOpen: (v: boolean) => void) {
  const editor = useEditor<ImageExtension>();
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) setUrl("");
  };
  const onUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value) setFile(null);
  };
  const reset = () =>
    setTimeout(() => {
      setUrl("");
      setFile(null);
    }, 300);
  const submit = () => {
    if (url) editor.commands.insertImage({ src: url });
    else if (file) editor.commands.uploadImage({ file, uploader });
    setOpen(false);
    reset();
  };
  return { url, file, onFileChange, onUrlChange, submit };
}

const fieldClass =
  "flex h-9 w-full rounded-md bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring/30 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:opacity-50";

const popoverClass =
  "flex flex-col gap-4 p-6 text-sm w-72 z-10 rounded-xl border border-border bg-card shadow-lg [&:not([data-state])]:hidden will-change-transform motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out motion-safe:data-[state=open]:fade-in-0 motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:zoom-in-95 motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:animate-duration-150 motion-safe:data-[state=closed]:animate-duration-200 motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=top]:slide-in-from-bottom-2";

function UrlInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        Embed Link
      </label>
      <input
        id={id}
        className={fieldClass}
        placeholder="Paste the image link…"
        type="url"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

function FileInput({
  id,
  onChange,
}: {
  id: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        Upload
      </label>
      <input id={id} className={fieldClass} accept="image/*" type="file" onChange={onChange} />
    </div>
  );
}

function ImagePopoverContent({
  uploader,
  setOpen,
}: {
  uploader: Uploader<string>;
  setOpen: (v: boolean) => void;
}) {
  const urlId = useId();
  const fileId = useId();
  const { url, file, onFileChange, onUrlChange, submit } = useImageUpload(uploader, setOpen);
  return (
    <PopoverContent className={popoverClass}>
      {!file && <UrlInput id={urlId} value={url} onChange={onUrlChange} />}
      {!url && <FileInput id={fileId} onChange={onFileChange} />}
      {(url || file) && <Button onClick={submit}>{url ? "Insert Image" : "Upload Image"}</Button>}
    </PopoverContent>
  );
}

export default function ImageUploadPopover({ uploader, tooltip, disabled, children }: Props) {
  const [open, setOpen] = useState(false);
  const onOpenChange = (v: boolean) => {
    if (!v) setTimeout(() => {}, 300);
    setOpen(v);
  };
  return (
    <PopoverRoot open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger>
        <ToolbarButton disabled={disabled} tooltip={tooltip}>
          {children}
        </ToolbarButton>
      </PopoverTrigger>
      <ImagePopoverContent uploader={uploader} setOpen={setOpen} />
    </PopoverRoot>
  );
}
