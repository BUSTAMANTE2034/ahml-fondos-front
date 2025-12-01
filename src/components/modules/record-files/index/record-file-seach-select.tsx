import { useState, useRef } from "react";
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

  /** ID seleccionado */
  value: number | null;

  /** onSelect */
  onChange: (id: number | null) => void;

  /** Lista generada desde el hook */
  results: ResultItem[];

  /** Loading del hook */
  loading?: boolean;

  /** Error del hook */
  searchError?: string | null;

  /** callback cuando el usuario escribe → actualiza query del hook */
  onQueryChange: (text: string) => void;

  /** Texto inicial */
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

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setQuery("");
    setShowList(false);
    onQueryChange("");
    onChange(null);
  };

  const handleSelect = (item: ResultItem) => {
    setQuery(item.label);
    onChange(item.id);
    setShowList(false);
  };

  return (
    <div className="flex flex-col mb-3 relative">
      {label && <label className="font-bold text-xs md:text-sm">{label}</label>}

      <div className="relative">
        <input
          ref={inputRef}
          className={classNames(
            "border-b border-dark-gray2 text-[10px] md:text-xs py-1 w-full pr-5 focus:outline-none",
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
        />

        {query && (
          <IconButton
            onClick={handleClear}
            tooltip="Limpiar"
            className="absolute! right-1 top-1/3 -translate-y-1/2"
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
      {!loading && showList && (
        <div className="transition-all bg-white shadow-md border border-dark-gray rounded-b-xl w-full z-50 max-h-60 overflow-y-auto">
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
              className="p-2 text-xs cursor-pointer hover:bg-gray-200"
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
