import { useState } from "react";
import classNames from "classnames";
import X from "@icons/close.svg";
import { IconButton } from "@/components/ui/iconButton";

interface Option {
  id: string;
  label: string;
}

interface StaticCheckSelectProps {
  label: string;
  placeholder?: string;
  options: Option[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

export const StaticCheckSearchSelect = ({
  label,
  placeholder,
  options,
  selectedIds,
  onChange,
  error,
}: StaticCheckSelectProps) => {
  const [query, setQuery] = useState("");
  const [showList, setShowList] = useState(false);

  const filtered =
    query.trim().length === 0
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
        );

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="flex flex-col mb-3 relative">
      {label && (
        <label className="font-bold text-xs md:text-sm mb-1">{label}</label>
      )}

      {/* INPUT */}
      <div className="relative">
        <input
          className={classNames(
            "border-b border-dark-gray2 text-[10px] md:text-xs py-1 w-full pr-8 focus:outline-none",
            { "border-red": !!error }
          )}
          placeholder={placeholder || "Buscar..."}
          value={query}
          onFocus={() => setShowList(true)}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* BOTÓN X */}
        {(query || showList) && (
          <IconButton
            onClick={() => {
              setQuery("");
              setShowList(false);
            }}
            className="absolute! right-1 top-1/2 -translate-y-1/2 z-20"
          >
            <img
              src={X}
              className="h-4 w-4 opacity-60 hover:opacity-90"
            />
          </IconButton>
        )}
      </div>

      {/* LISTA FLOTANTE (NO EMPUJA EL CONTENIDO) */}
      <div
        className={classNames(
          `
          absolute left-0 top-[calc(100%+2px)]
          bg-white shadow-md border border-dark-gray rounded-b-xl
          w-full max-h-60 overflow-auto z-50
        `,
          { hidden: !showList }
        )}
      >
        {filtered.length === 0 && (
          <div className="p-2 text-xs text-gray-500">Sin resultados</div>
        )}

        {filtered.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2 p-2 text-xs cursor-pointer hover:bg-gray-200"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(opt.id)}
              onChange={() => toggle(opt.id)}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* CHIPS */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedIds.map((id) => (
            <div
              key={id}
              className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-3xl text-xs flex items-center gap-1"
            >
              {options.find((o) => o.id === id)?.label || id}

              <button
                onClick={() => toggle(id)}
                className="flex items-center justify-center"
              >
                <img
                  src={X}
                  className="w-5 h-5 cursor-pointer rounded-full hover:bg-blue-200 active:bg-blue-300 p-1"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <span className="text-red text-[10px] mt-1">{error}</span>
      )}
    </div>
  );
};
