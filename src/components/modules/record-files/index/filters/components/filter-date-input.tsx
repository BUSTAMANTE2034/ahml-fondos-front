import { X } from "lucide-react"

interface DateInputProps {
  value: string | null
  onChange: (v: string | null) => void
}

export const FilterDateInput = ({ value, onChange }: DateInputProps) => {
  return (
    <div className="relative w-full">
      <input
        type="date"
        className=" font-normal
          w-full text-xs rounded-md px-2 py-1 
          border border-gray-300
          focus:border-blue-400 focus:ring-1 focus:ring-blue-300
          focus:outline-none
        "
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="
            absolute right-6 top-1/2 -translate-y-1/2
            text-blue-600 hover:text-blue-700
            p-1 rounded-full cursor-pointer
            hover:bg-main-gray active:bg-dark-gray
          "
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
