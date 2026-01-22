import { DIAGNOSIS_CONCEPTS } from '@/components/ui/functions'

type Props = {
  concept: string | null
  setConcept: (value: string | null) => void
}

const ConceptFilter = ({ concept, setConcept }: Props) => {
  const handleChange = (value: string) => {
    setConcept(value === '' ? null : value)
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs text-dark-gray2 px-1">
        Concepto
      </label>

      <select
        value={concept ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        className="text-xs px-3 py-1.5 rounded-3xl border border-gray-2
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Todos los conceptos</option>

        {DIAGNOSIS_CONCEPTS.map((c:any) => (
          <option key={c.id} value={c.label}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ConceptFilter
