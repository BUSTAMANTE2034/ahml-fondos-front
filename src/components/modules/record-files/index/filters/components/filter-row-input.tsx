import { X } from "lucide-react"

interface RowInputProps {
  value: string
  placeholder: string
  onChange: (v: string) => void
}

export const FilterRowInput = ({ value, placeholder, onChange }: RowInputProps) => {
  return (
    <div className="relative w-full font-normal">
      <input
        type="text"
        className={`
          w-full text-xs rounded-md px-2 py-1 ${value&&'pr-5'} 
          border border-gray-300 
          focus:border-blue-400 focus:ring-1 focus:ring-blue-300 
          focus:outline-none
        `}        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="
            absolute right-1.5 top-1/2 -translate-y-1/2 
            text-blue-600 hover:text-blue-800 
            p-0.5 rounded-full cursor-pointer
            hover:bg-gray-200 active:bg-gray-300
          "
        >
          <X size={12} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
