import { ImagePlus, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MAX_BYTES = 2 * 1024 * 1024;

interface CoverUploadProps {
  id?: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

/** Image picker with drag-and-drop and preview. Stores a data URL (swap for an upload URL later). */
export function CoverUpload({ id = 'cover-upload', value, onChange }: CoverUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return void toast.error('Please choose an image file.');
    if (file.size > MAX_BYTES) return void toast.error('Image must be 2 MB or smaller.');
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' && onChange(reader.result);
    reader.onerror = () => toast.error('Could not read that file.');
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files[0]);
  };

  const input = (
    <input
      ref={inputRef}
      id={id}
      type="file"
      accept="image/*"
      className="sr-only"
      onChange={(e) => {
        readFile(e.target.files?.[0]);
        e.target.value = '';
      }}
    />
  );

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-lg border">
        {input}
        <img src={value} alt="Course cover preview" className="aspect-[16/8] w-full object-cover" />
        <div className="absolute bottom-2 right-2 flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
          >
            <Upload aria-hidden /> Change
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => onChange(null)}>
            <Trash2 aria-hidden /> Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <label
      htmlFor={id}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'flex aspect-[16/6] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center text-sm text-muted-foreground transition-colors focus-within:ring-2 focus-within:ring-ring hover:bg-muted/50',
        dragging && 'border-primary bg-primary/5',
      )}
    >
      {input}
      <ImagePlus className="size-6" aria-hidden />
      <span>
        <span className="font-medium text-foreground">Click to upload</span> or drag an image here
      </span>
      <span className="text-xs">PNG or JPG, up to 2 MB. Leave empty for a generated cover.</span>
    </label>
  );
}
