interface FilterSelectProps<T extends string> {
  value: T
  onChange: (v: T) => void
  children: React.ReactNode
}

export function FilterSelect<T extends string>({
  value,
  onChange,
  children,
}: FilterSelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
      className=" font-normal
        w-full text-xs rounded-md px-2 py-1
        border border-gray-300
        focus:border-blue-400 focus:ring-1 focus:ring-blue-300
        focus:outline-none
      "
    >
      {children}
    </select>
  )
}
