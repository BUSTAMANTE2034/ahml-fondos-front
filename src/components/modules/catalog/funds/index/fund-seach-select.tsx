import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import X from '@icons/close.svg'
import { IconButton } from '@/components/ui/iconButton'

interface ResultItem {
  id: number
  label: string
}

interface AsyncSearchSelectProps {
  label?: string
  placeholder?: string
  value: number | null
  onChange: (id: number | null) => void
  searchFn: (query: string) => Promise<ResultItem[]>
  error?: string
  initialLabel?: string
}

export const AsyncSearchSelect = ({
  label,
  placeholder,
  value,
  onChange,
  searchFn,
  error,
  initialLabel
}: AsyncSearchSelectProps) => {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [results, setResults] = useState<ResultItem[]>([])
  const [showList, setShowList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const [isSelecting, setIsSelecting] = useState(false)
  const [hasSelected, setHasSelected] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  // --- INITIAL LABEL ---
  useEffect(() => {
    if (initialLabel) {
      setQuery(initialLabel)
      setHasSelected(true)
    }
  }, [initialLabel])

  // --- DEBOUNCE ---
  useEffect(() => {
    if (isSelecting || hasSelected) return

    const id = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(id)
  }, [query, isSelecting, hasSelected])

  // --- SEARCH ---
  useEffect(() => {
    if (hasSelected) return

    const load = async () => {
      if (!debounced.trim()) {
        setResults([])
        setShowList(false)
        setSearchError(null)
        return
      }

      setLoading(true)
      setSearchError(null)

      try {
        const items = await searchFn(debounced)
        setResults(items)
        setShowList(true)
      } catch (err) {
        console.error(err)
        setResults([])
        setSearchError('Error al buscar')
        setShowList(true)
      }

      setLoading(false)
    }

    load()
  }, [debounced, searchFn, hasSelected])

  // --- CLEAR ---
  const handleClear = () => {
    setQuery('')
    setDebounced('')
    setHasSelected(false)
    setResults([])
    setShowList(false)
    setSearchError(null)
    onChange(null)
  }

  // --- SELECT ITEM ---
  const handleSelect = (item: ResultItem) => {
    setIsSelecting(true)
    setHasSelected(true)

    setQuery(item.label)
    setDebounced('')
    setResults([])
    setShowList(false)
    setSearchError(null)

    onChange(item.id)

    inputRef.current?.blur()
    setTimeout(() => setIsSelecting(false), 0)
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
          onChange={(e) => {
            setQuery(e.target.value)
            setHasSelected(false)
          }}
        />

        {query && (
          <IconButton
            onClick={handleClear}
            tooltip="Limpiar"
            className="absolute! right-1 top-1/3 -translate-y-1/2"
          >
            <img src={X} alt="" className="h-6 w-6" />
          </IconButton>
        )}
      </div>

      {/* LOADING */}
      {loading && !hasSelected && (
        <div className="absolute top-full left-0 w-full bg-white p-2 text-xs shadow-md z-50">
          Buscando...
        </div>
      )}

      {/* LISTA DE RESULTADOS */}
      <div
        className={classNames(
          'transition-all duration-150 overflow-hidden bg-white shadow-md border border-dark-gray rounded-b-xl w-full z-50',
          {
            'max-h-0 opacity-0': !showList || loading || hasSelected,
            'max-h-60 opacity-100': showList && !loading && !hasSelected,
          }
        )}
      >
        {/* ERROR */}
        {!loading && searchError && (
          <div className="p-2 text-xs text-red">{searchError}</div>
        )}

        {/* SIN RESULTADOS */}
        {!loading && !searchError && results.length === 0 && (
          <div className="p-2 text-xs text-gray-500">Sin resultados</div>
        )}

        {/* RESULTADOS */}
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

      {error && <span className="text-red text-[10px] mt-1">{error}</span>}
    </div>
  )
}
