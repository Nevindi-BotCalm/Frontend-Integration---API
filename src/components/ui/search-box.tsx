import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  loading?: boolean;
  className?: string;
}

export function SearchBox({
  placeholder = 'Search...',
  value = '',
  onChange,
  loading = false,
  className,
}: SearchBoxProps) {
  return (
    <div className={cn('relative', className)}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-8"
      />
      {loading && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Loading size="sm" />
        </div>
      )}
    </div>
  );
}
