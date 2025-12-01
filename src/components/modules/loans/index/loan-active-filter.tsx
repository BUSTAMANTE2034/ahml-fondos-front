type Props = {
  is_active: boolean | null
  setIsActive: (value: boolean | null) => void
}

const ActiveFilter = ({ is_active, setIsActive }: Props) => {
  // Cómo se ven los checkboxes según is_active actual
  const activeChecked = is_active === true
  const inactiveChecked = is_active === false

  const computeNext = (active: boolean, inactive: boolean): boolean | null => {
    if (active && !inactive) return true      // solo activos
    if (!active && inactive) return false     // solo inactivos
    return null                               // ambos o ninguno → todos
  }

  const handleActiveChange = (checked: boolean) => {
    const next = computeNext(checked, inactiveChecked)
    setIsActive(next)
  }

  const handleInactiveChange = (checked: boolean) => {
    const next = computeNext(activeChecked, checked)
    setIsActive(next)
  }

  return (
    <div className="flex flex-col gap-2  w-full">
      <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-1 active:bg-gray-2 rounded-3xl p-1 px-2">
        <input
          type="checkbox"
          className="accent-blue-500 cursor-pointer"
          checked={activeChecked}
          onChange={(e) => handleActiveChange(e.target.checked)}
        />
        Activos
      </label>

      <label className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-1 active:bg-gray-2 rounded-3xl p-1 px-2">
        <input
          type="checkbox"
          className="accent-blue-500 cursor-pointer"
          checked={inactiveChecked}
          onChange={(e) => handleInactiveChange(e.target.checked)}
        />
        Inactivos
      </label>
    </div>
  )
}

export default ActiveFilter
