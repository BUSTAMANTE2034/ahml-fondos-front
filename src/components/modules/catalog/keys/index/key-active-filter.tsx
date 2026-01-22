type Props = {
  is_active: boolean | null
  setIsActive: (value: boolean | null) => void

  entity_type: string[]
  setEntityType: (value: string[]) => void
}

const ActiveFilter = ({
  is_active,
  setIsActive,
  entity_type,
  setEntityType,
}: Props) => {
  const activeChecked = is_active === true
  const inactiveChecked = is_active === false

  const computeNext = (active: boolean, inactive: boolean): boolean | null => {
    if (active && !inactive) return true
    if (!active && inactive) return false
    return null
  }

  const ENTITY_TYPES = [
    { key: 'fund', label: 'Fondo' },
    { key: 'section', label: 'Sección' },
    { key: 'series', label: 'Serie' },
  ]

  const toggleEntity = (key: string, checked: boolean) => {
    checked
      ? setEntityType([...entity_type, key])
      : setEntityType(entity_type.filter((t) => t !== key))
  }

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* ESTADO */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm px-3 py-2">
        <p className="text-[11px] font-semibold text-blue-600 mb-1">
          Estado
        </p>

        <div className="flex flex-col">
          <label className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1 hover:bg-blue-100/60">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={activeChecked}
              onChange={(e) =>
                setIsActive(computeNext(e.target.checked, inactiveChecked))
              }
            />
            Activos
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1 hover:bg-blue-100/60">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={inactiveChecked}
              onChange={(e) =>
                setIsActive(computeNext(activeChecked, e.target.checked))
              }
            />
            Inactivos
          </label>
        </div>
      </div>

      {/* TIPO DE ENTIDAD */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/40 shadow-sm px-3 py-2">
        <p className="text-[11px] font-semibold text-blue-600 mb-1">
          Tipo de entidad
        </p>

        <div className="flex flex-col">
          {ENTITY_TYPES.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 text-sm cursor-pointer rounded-lg px-2 py-1 hover:bg-blue-100/60"
            >
              <input
                type="checkbox"
                className="accent-blue-600"
                checked={entity_type.includes(item.key)}
                onChange={(e) =>
                  toggleEntity(item.key, e.target.checked)
                }
              />
              {item.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}


export default ActiveFilter
