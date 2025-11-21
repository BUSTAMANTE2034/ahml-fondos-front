type Props = {
  is_active: boolean | null
  setIsActive: (value: boolean | null) => void

  entity_type: string[]
  setEntityType: (value: string[]) => void
}

const ActiveFilter = ({ is_active, setIsActive, entity_type, setEntityType }: Props) => {
  // ---- ACTIVO / INACTIVO ----
  const activeChecked = is_active === true
  const inactiveChecked = is_active === false

  const computeNext = (active: boolean, inactive: boolean): boolean | null => {
    if (active && !inactive) return true      // solo activos
    if (!active && inactive) return false     // solo inactivos
    return null                               // ambos → todos
  }

  const handleActiveChange = (checked: boolean) => {
    const next = computeNext(checked, inactiveChecked)
    setIsActive(next)
  }

  const handleInactiveChange = (checked: boolean) => {
    const next = computeNext(activeChecked, checked)
    setIsActive(next)
  }

  // ---- ENTITY TYPE (fund / section / series) ----
  const ENTITY_TYPES = [
    { key: "fund", label: "Fondo" },
    { key: "section", label: "Sección" },
    { key: "series", label: "Serie" }
  ]

  const toggleEntity = (key: string, checked: boolean) => {
    if (checked) {
      setEntityType([...entity_type, key])
    } else {
      setEntityType(entity_type.filter(t => t !== key))
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* ACTIVO / INACTIVO */}
      <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-1 rounded-3xl p-1 px-2">
        <input
          type="checkbox"
          className="accent-blue-500 cursor-pointer"
          checked={activeChecked}
          onChange={(e) => handleActiveChange(e.target.checked)}
        />
        Activos
      </label>

      <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-1 rounded-3xl p-1 px-2">
        <input
          type="checkbox"
          className="accent-blue-500 cursor-pointer"
          checked={inactiveChecked}
          onChange={(e) => handleInactiveChange(e.target.checked)}
        />
        Inactivos
      </label>

      {/* ENTITY TYPES */}
      {ENTITY_TYPES.map((item) => (
        <label
          key={item.key}
          className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-1 rounded-3xl p-1 px-2"
        >
          <input
            type="checkbox"
            className="accent-blue-500 cursor-pointer"
            checked={entity_type.includes(item.key)}
            onChange={(e) => toggleEntity(item.key, e.target.checked)}
          />
          {item.label}
        </label>
      ))}
    </div>
  )
}

export default ActiveFilter
