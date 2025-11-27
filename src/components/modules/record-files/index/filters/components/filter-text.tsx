import { X } from "lucide-react"

type Props = {
  label: string
  value: string
  onChange: (v: string) => void
}

const FilterText = ({ label, value, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-1 ">
      <p className="text-xs font-semibold">{label}</p>

      <div className="relative w-full">
        <input
          type="text"
          className={`
            w-full text-xs rounded-3xl px-2 py-1.5 pr-2 
            border border-gray-4 
            focus:border-blue-400 focus:ring-1 focus:ring-blue-400 
            focus:outline-none
            placeholder:text-dark2-gray 
          `}
          placeholder={`Buscar ${label.toLowerCase()}...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {/* Botón de limpiar (solo aparece cuando hay texto) */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="
              absolute right-2 top-1/2 -translate-y-1/2 
              text-blue-600 hover:text-blue-600 
              p-1 rounded-full  cursor-pointer hover:bg-main-gray active:bg-dark-gray
            "
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterText
