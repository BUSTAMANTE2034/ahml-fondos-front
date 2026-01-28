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
      className="
        w-full min-w-0 font-normal
ounded-md px-2 py-1
        text-xs
        border border-gray-300
        focus:border-blue-400 focus:ring-1 focus:ring-blue-300
        focus:outline-none
        truncate
      "
    >
      {children}
    </select>
  )
}
