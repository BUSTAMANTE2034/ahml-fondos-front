type Props = {
  detail: string | null
  setDetail: (value: string | null) => void
}

const DetailFilter = ({ detail, setDetail }: Props) => {
  const handleChange = (value: string) => {
    const v = value.trim()
    setDetail(v === '' ? null : v)
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs text-dark-gray2 px-1">
        Detalle
      </label>

      <input
        type="text"
        value={detail ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Buscar por detalle"
        className="text-xs px-3 py-1.5 rounded-3xl border border-gray-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

export default DetailFilter
