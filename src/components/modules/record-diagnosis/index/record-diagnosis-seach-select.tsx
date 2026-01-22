import { useState, useRef, useEffect } from "react";
import classNames from "classnames";
import X from "@icons/close.svg";
import { IconButton } from "@/components/ui/iconButton";

interface ResultItem {
  id: number;
  label: string;
}

interface AsyncSearchSelectProps {
  label?: string;
  placeholder?: string;
  value: number | null;
  onChange: (id: number | null) => void;
  results: ResultItem[];
  loading?: boolean;
  searchError?: string | null;
  onQueryChange: (text: string) => void;
  initialLabel?: string;
  error?: string;
}

export const AsyncSearchSelect = ({
  label,
  placeholder,
  value,
  onChange,
  results,
  loading = false,
  searchError,
  onQueryChange,
  initialLabel,
  error,
}: AsyncSearchSelectProps) => {
  const [query, setQuery] = useState(initialLabel || "");
  const [showList, setShowList] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClear = () => {
    setQuery("");
    onQueryChange("");
    onChange(null);
    setShowList(false);
  };

  const handleSelect = (item: ResultItem) => {
    setQuery(item.label);
    onChange(item.id);
    setShowList(false);
  };

  const showClearButton = query.trim() !== "" || showList || value !== null;

  // NEW — cerrar cuando pierdas clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowList(false);

        // limpiar si no hay selección
        if (!value) {
          setQuery("");
          onQueryChange("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value, onQueryChange]);

  return (
    <div className="flex flex-col mb-3 relative" ref={containerRef}>
      {label && <label className="font-bold text-xs md:text-sm">{label}</label>}

      <div className="relative">
        <input
          className={classNames(
            "border-b border-dark-gray2 text-xs md:text-sm py-1 w-full pr-5 focus:outline-none",
            { "border-red": !!error }
          )}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            const text = e.target.value;
            setQuery(text);
            onQueryChange(text);
            setShowList(true);
          }}
          onFocus={() => {
            if (!query.trim()) {
              onQueryChange("");
            }
            setShowList(true);
          }}
        />

        {showClearButton && (
          <IconButton
            onClick={handleClear}
            tooltip="Limpiar"
            className="absolute! right-1 top-1/2 -translate-y-1/2"
          >
            <img src={X} alt="" className="h-4 w-4" />
          </IconButton>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <div className="absolute top-full left-0 w-full bg-white p-2 text-xs shadow-md z-50">
          Buscando…
        </div>
      )}

      {/* LISTA */}
{false && (
  <div
    className="
      absolute left-0 top-[calc(100%+2px)]
      w-full
      bg-white
      shadow-lg
      border border-dark-gray
      rounded-b-xl
      z-50
      max-h-60
      overflow-y-auto
      scroll-t
    "
  >
    {!!searchError && (
      <div className="p-2 text-xs text-red">{searchError}</div>
    )}

    {!searchError && results.length === 0 && query.trim() && (
      <div className="p-2 text-xs text-gray-500">Sin resultados</div>
    )}

    {results.map((item) => (
      <div
        key={item.id}
        onClick={() => handleSelect(item)}
        className="px-2 py-1 text-xs cursor-pointer hover:bg-gray-200"
      >
        {item.label}
      </div>
    ))}
  </div>
)}


      {error && <span className="text-red text-[10px] mt-1">{error}</span>}
    </div>
  );
};
