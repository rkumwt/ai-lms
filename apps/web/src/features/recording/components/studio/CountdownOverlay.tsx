import { Button } from '@/components/ui/button';

export function CountdownOverlay({ value, onCancel }: { value: number; onCancel: () => void }) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-black/60 backdrop-blur-sm">
      <span
        key={value}
        className="text-[9rem] font-bold leading-none text-white duration-300 animate-in fade-in zoom-in-50"
        aria-live="assertive"
        aria-label={`Recording starts in ${value}`}
      >
        {value}
      </span>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
