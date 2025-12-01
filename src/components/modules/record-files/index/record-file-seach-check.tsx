import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import X from '@icons/close.svg'
import { IconButton } from '@/components/ui/iconButton'

interface ResultItem {
  id: number
  label: string
}

interface AsyncCheckSearchSelectProps {
  label?: string
  placeholder?: string
  selectedIds: number[]
  onChange: (ids: number[]) => void

  // NUEVO — fuera viene todo
  results: ResultItem[]
  loading: boolean
  searchError: string | null
  onQueryChange: (q: string) => void

  error?: string
}

export const AsyncCheckSearchSelect = ({
  label,
  placeholder,
  selectedIds,
  onChange,

  // nuevos props
  results,
  loading,
  searchError,
  onQueryChange,

  error
}: AsyncCheckSearchSelectProps) => {

  const [query, setQuery] = useState('')
  const [showList, setShowList] = useState(false)

  // Diccionario persistente id → label
  const [selectedMap, setSelectedMap] = useState<Record<number, string>>({})

  const inputRef = useRef<HTMLInputElement>(null)

  // Mantiene labels aunque cambie el query
  useEffect(() => {
    const map = { ...selectedMap }
    selectedIds.forEach((id) => {
      const found = results.find((r) => r.id === id)
      if (found) map[id] = found.label
    })
    setSelectedMap(map)
  }, [results, selectedIds])

  // Cuando escribes → notifica al padre
  const handleInput = (value: string) => {
    setQuery(value)
    onQueryChange(value)

    if (!value.trim()) {
      setShowList(false)
    } else {
      setShowList(true)
    }
  }

  // Seleccionar
  const toggleCheck = (id: number, label: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      setSelectedMap((prev) => ({ ...prev, [id]: label }))
      onChange([...selectedIds, id])
    }
  }

  // Remover chip
  const removeChip = (id: number) => {
    onChange(selectedIds.filter((x) => x !== id))
  }

  return (
    <div className="flex flex-col mb-3 relative">
      {label && <label className="font-bold text-xs md:text-sm">{label}</label>}

      <div className="relative">
        <input
          ref={inputRef}
          className={classNames(
            'border-b border-dark-gray2 text-[10px] md:text-xs py-1 w-full pr-5 focus:outline-none',
            { 'border-red': !!error }
          )}
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInput(e.target.value)}
        />

        {query && (
          <IconButton
            onClick={() => {
              setQuery('')
              onQueryChange('')
              setShowList(false)
            }}
            className="absolute! right-1 top-1/3 -translate-y-1/2"
          >
            <img src={X} className="h-4 w-4" />
          </IconButton>
        )}
      </div>

      {/* LISTA */}
      {showList && (
        <div className="bg-white absolute top-full left-0 w-full shadow-md border border-dark-gray rounded-b-xl max-h-60 overflow-auto z-50">

          {/* LOADING */}
          {loading && (
            <div className="p-2 text-xs text-gray-600">Buscando…</div>
          )}

          {/* ERROR */}
          {!loading && searchError && (
            <div className="p-2 text-xs text-red">{searchError}</div>
          )}

          {/* SIN RESULTADOS */}
          {!loading && !searchError && results.length === 0 && query.trim() && (
            <div className="p-2 text-xs text-gray-500">Sin resultados</div>
          )}

          {/* RESULTADOS */}
          {!loading &&
            !searchError &&
            results.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-2 p-2 text-xs cursor-pointer hover:bg-gray-200"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleCheck(item.id, item.label)}
                />
                {item.label}
              </label>
            ))}
        </div>
      )}

      {/* CHIPS */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedIds.map((id) => (
            <div
              key={id}
              className="bg-blue-100 text-blue-700 font-medium px-3 py-1 rounded-3xl text-xs flex items-center gap-1"
            >
              {selectedMap[id] || `ID ${id}`}
              <button onClick={() => removeChip(id)}>
                <img
                  src={X}
                  className="w-6 h-6 cursor-pointer rounded-3xl hover:bg-blue-200 active:bg-blue-300 p-1"
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <span className="text-red text-[10px] mt-1">{error}</span>}
    </div>
  )
}
