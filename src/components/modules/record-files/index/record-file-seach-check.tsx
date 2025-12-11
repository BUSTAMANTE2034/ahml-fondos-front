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

  results: ResultItem[]
  loading: boolean
  searchError: string | null
  onQueryChange: (q: string) => void

  error?: string
  initialSelected?: { id: number; label: string }[]
}

export const AsyncCheckSearchSelect = ({
  label,
  placeholder,
  selectedIds,
  onChange,

  results,
  loading,
  searchError,
  onQueryChange,

  error,
  initialSelected
}: AsyncCheckSearchSelectProps) => {

  const [query, setQuery] = useState('')
  const [showList, setShowList] = useState(false)
  const [selectedMap, setSelectedMap] = useState<Record<number, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Mostrar la X igual que en el otro Select
  const showClearButton =
    query.trim() !== '' || showList || selectedIds.length > 0

  // Inicializar labels
  useEffect(() => {
    const map: Record<number, string> = { ...selectedMap }

    initialSelected?.forEach((item) => {
      map[item.id] = item.label
    })

    results.forEach((r) => {
      if (selectedIds.includes(r.id)) {
        map[r.id] = r.label
      }
    })

    setSelectedMap(map)
  }, [initialSelected, results, selectedIds])

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowList(false)

        // limpiar si usuario no seleccionó nada
        if (query.trim() && selectedIds.length === 0) {
          setQuery('')
          onQueryChange('')
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () =>
      document.removeEventListener('mousedown', handleClickOutside)
  }, [query, selectedIds])

  // Buscar cuando escribes
  const handleInput = (value: string) => {
    setQuery(value)
    onQueryChange(value)
    setShowList(true)
  }

  // Seleccionar o deseleccionar
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
    <div className="flex flex-col mb-3 relative" ref={containerRef}>
      {label && <label className="font-bold text-xs md:text-sm">{label}</label>}

      {/* INPUT */}
      <div className="relative">
        <input
          className={classNames(
            'border-b border-dark-gray2 text-[10px] md:text-xs py-1 w-full pr-5 focus:outline-none',
            { 'border-red': !!error }
          )}
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => {
            if (!query.trim()) onQueryChange('')
            setShowList(true)
          }}
        />

        {showClearButton && (
          <IconButton
            onClick={() => {
              setQuery('')
              onQueryChange('')
              setShowList(false)
              onChange([]) // limpiar selección también
            }}
            className="absolute! right-1 top-1/2 -translate-y-1/2"
            tooltip="Limpiar"
          >
            <img src={X} className="h-4 w-4" />
          </IconButton>
        )}
      </div>

      {/* DROPDOWN flotante */}
      {!loading && showList && (
        <div
          className="
            absolute left-0 top-[calc(100%+2px)]
            w-full bg-white shadow-lg border border-dark-gray
            rounded-b-xl z-50 max-h-60 overflow-y-auto scroll-t
          "
        >
          {searchError && (
            <div className="p-2 text-xs text-red">{searchError}</div>
          )}

          {!searchError && results.length === 0 && query.trim() !== '' && (
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
      )}

      {/* LOADING */}
      {loading && (
        <div className="absolute left-0 top-[calc(100%+2px)] bg-white w-full p-2 text-xs shadow z-50">
          Buscando…
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
