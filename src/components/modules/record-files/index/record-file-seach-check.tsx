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
  searchFn: (query: string) => Promise<ResultItem[]>
  error?: string
}

export const AsyncCheckSearchSelect = ({
  label,
  placeholder,
  selectedIds,
  onChange,
  searchFn,
  error,
}: AsyncCheckSearchSelectProps) => {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [results, setResults] = useState<ResultItem[]>([])
  const [showList, setShowList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // 🟦 NUEVO: Diccionario id → label
  const [selectedMap, setSelectedMap] = useState<Record<number, string>>({})

  const inputRef = useRef<HTMLInputElement>(null)

  // Mantener las labels aunque cambie el query
  useEffect(() => {
    // integridad simple
    const map = { ...selectedMap }
    selectedIds.forEach((id) => {
      const existing = results.find((r) => r.id === id)
      if (existing) map[id] = existing.label
    })
    setSelectedMap(map)
  }, [results])

  // debounce
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(id)
  }, [query])

  // search
  useEffect(() => {
    const load = async () => {
      if (!debounced.trim()) {
        setResults([])
        setShowList(false)
        return
      }

      setLoading(true)
      setSearchError(null)

      try {
        const items = await searchFn(debounced)
        setResults(items)
        setShowList(true)
      } catch (err) {
        setResults([])
        setSearchError('Error al buscar')
        setShowList(true)
      }

      setLoading(false)
    }

    load()
  }, [debounced, searchFn])

  // Toggle
  const toggleCheck = (id: number, label: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id))
    } else {
      // Guardar label para siempre
      setSelectedMap((prev) => ({ ...prev, [id]: label }))
      onChange([...selectedIds, id])
    }
  }

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
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <IconButton
            onClick={() => {
              setQuery('')
              setDebounced('')
              setShowList(false)
            }}
            className="absolute! right-1 top-1/3 -translate-y-1/2"
          >
            <img src={X} className="h-4 w-4" />
          </IconButton>
        )}
      </div>

      {/* LISTA */}
      <div
        className={classNames(
          'transition-all duration-150 overflow-auto bg-white shadow-md border border-dark-gray rounded-b-xl w-full z-50 max-h-60',
          { hidden: !showList || loading }
        )}
      >
        {searchError && (
          <div className="p-2 text-xs text-red">{searchError}</div>
        )}

        {!loading && !searchError && results.length === 0 && (
          <div className="p-2 text-xs text-gray-500">Sin resultados</div>
        )}

        {results.map((item) => (
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

      {/* LABELS PERSISTENTES */}
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
