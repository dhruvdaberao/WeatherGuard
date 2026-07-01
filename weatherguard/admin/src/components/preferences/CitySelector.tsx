import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, Check, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/cn';

interface CitySelectorProps {
  value: string;
  onChange: (city: string) => void;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
}

export function CitySelector({ value, onChange }: CitySelectorProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    // If user deleted the text completely
    if (!debouncedQuery) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedQuery
          )}&format=json&limit=5&featuretype=settlement&addressdetails=1`
        );
        const data = await response.json();
        
        const formattedResults = data?.map((r: any) => {
          const city = r.address?.city || r.address?.town || r.address?.village || r.name;
          const state = r.address?.state;
          const country = r.address?.country;
          const displayName = [city, state, country].filter(Boolean).join(', ');
          
          return {
            place_id: r.place_id,
            display_name: displayName
          };
        }).filter((r: any, index: number, self: any[]) => 
          r.display_name && index === self.findIndex((t) => t.display_name === r.display_name)
        ) || [];
        
        setResults(formattedResults);
        setIsOpen(formattedResults.length > 0);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [debouncedQuery, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    setQuery(city);
    onChange(city);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex].display_name);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <label className="text-sm font-medium leading-none">Alert City</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="e.g. Pune, Maharashtra"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === '') {
              onChange('');
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="pl-9 pr-9"
        />
        {isLoading ? (
          <div className="absolute right-3 top-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
            title="Clear city"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <ul className="max-h-[300px] overflow-auto p-1">
            {results.map((result, index) => {
              const isSelected = index === selectedIndex;
              const isCurrentValue = result.display_name === value;
              
              return (
                <li
                  key={result.place_id}
                  onClick={() => handleSelect(result.display_name)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                    isSelected ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 hover:text-accent-foreground',
                    isCurrentValue && 'font-medium'
                  )}
                >
                  <MapPin className="mr-2 h-4 w-4 opacity-50" />
                  <span className="truncate">{result.display_name}</span>
                  {isCurrentValue && <Check className="ml-auto h-4 w-4" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Search and select the primary city for weather alerts.</p>
    </div>
  );
}
