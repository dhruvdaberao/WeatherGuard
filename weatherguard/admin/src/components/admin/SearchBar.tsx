import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { useEffect, useState, useRef } from 'react';

interface SearchBarProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search users...' }: SearchBarProps) {
  const [value, setValue] = useState('');
  const prevValueRef = useRef(value);

  // Debounce search only when input value actually changes
  useEffect(() => {
    if (prevValueRef.current === value) {
      return;
    }
    prevValueRef.current = value;

    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [value, onSearch]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <Search className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-12 h-11 text-base bg-card rounded-full"
      />
    </div>
  );
}
