import React, { useState, useEffect, useRef } from "react"
import { IconButton } from "./iconButton"
import CalendarIcon from "@icons/calendar.svg"
import CloseIcon from "@icons/close.svg"

interface SingleDatePickerProps {
  label: string
  value: string | null              // <-- dd-mm-aaaa
  onChange: (v: string | null) => void
}

const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

// Convertir dd-mm-aaaa → Date
const parseLocalDate = (str: string | null): Date | null => {
  if (!str) return null
  const [d, m, y] = str.split("-")
  return new Date(Number(y), Number(m) - 1, Number(d))
}

// Convertir Date → dd-mm-aaaa
const formatLocalDate = (date: Date | null): string => {
  if (!date) return ""
  const d = String(date.getDate()).padStart(2, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const y = date.getFullYear()
  return `${d}-${m}-${y}`
}

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  label,
  value,
  onChange
}) => {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value ?? "")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDate = parseLocalDate(value)
  const today = selectedDate || new Date()

  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  // Cuando se abre: moverse al mes de la fecha seleccionada
  useEffect(() => {
    if (open && selectedDate) {
      setCurrentMonth(selectedDate.getMonth())
      setCurrentYear(selectedDate.getFullYear())
    }
  }, [open, selectedDate])

  // Cerrar popup al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener("mousedown", handler)
    return () => window.removeEventListener("mousedown", handler)
  }, [open])

  // Sync con valor externo
  useEffect(() => {
    setInputValue(value ?? "")
  }, [value])

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate()

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const totalDays = getDaysInMonth(currentYear, currentMonth)

  const handleSelectDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const formatted = formatLocalDate(date)
    onChange(formatted)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInputValue(v)

    const isValid = /^\d{2}-\d{2}-\d{4}$/.test(v)
    if (isValid) onChange(v)
  }

  return (
    <div ref={containerRef} className="relative w-full">

      {/* INPUT + BOTONES */}
      <div
        className={`relative flex items-center rounded-3xl my-1 px-2 py-0.5 cursor-pointer
          border border-gray-4
          ${value ? "bg-blue-600 text-white" : "bg-gray-0 hover:bg-dark-gray active:bg-gray-2"}
        `}
      >
        <input
          type="text"
          placeholder={label}
          className={`w-full text-xs outline-none bg-transparent 
            ${value ? "placeholder:text-white text-white" : "placeholder:text-dark2-gray text-tblack"}
          `}
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setOpen(true)}
        />

        {value ? (
          <IconButton
            className="w-6 h-6 hover:bg-blue-700! active:bg-blue-800!"
            tooltip="Limpiar"
            onClick={(e) => {
              e.stopPropagation()
              setInputValue("")
              onChange(null)
              setOpen(false)
            }}
          >
            <img src={CloseIcon} alt="clear" className="invert" />
          </IconButton>
        ) : (
          <IconButton
            className="w-6 h-6"
            tooltip="Seleccionar fecha"
            onClick={(e) => {
              e.stopPropagation()
              setOpen(!open)
            }}
          >
            <img src={CalendarIcon} alt="calendar" />
          </IconButton>
        )}
      </div>

      {/* CALENDARIO */}
      {open && (
        <div className="absolute z-50 mt-2 right-20 top-5 p-2 bg-white border border-gray-4 rounded-3xl shadow-md w-64">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-2">
            <button
              className="text-xs"
              onClick={() => {
                setCurrentMonth((m) => (m === 0 ? 11 : m - 1))
                if (currentMonth === 0) setCurrentYear((y) => y - 1)
              }}
            >
              ◀
            </button>

            <span className="text-xs font-bold">
              {new Date(currentYear, currentMonth).toLocaleString("es-MX", {
                month: "long",
                year: "numeric"
              })}
            </span>

            <button
              className="text-xs"
              onClick={() => {
                setCurrentMonth((m) => (m === 11 ? 0 : m + 1))
                if (currentMonth === 11) setCurrentYear((y) => y + 1)
              }}
            >
              ▶
            </button>
          </div>

          {/* DÍAS SEMANA */}
          <div className="grid grid-cols-7 text-center text-[10px] mb-1">
            {daysOfWeek.map((d) => (
              <div key={d} className="font-semibold text-gray-700">{d}</div>
            ))}
          </div>

          {/* DÍAS */}
          <div className="grid grid-cols-7 text-center text-xs gap-1">

            {/* espacios vacíos */}
            {Array(firstDay === 0 ? 6 : firstDay - 1)
              .fill(null)
              .map((_, i) => <div key={i}></div>)}

            {Array.from({ length: totalDays }).map((_, i) => {
              const day = i + 1

              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === currentYear &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getDate() === day

              return (
                <button
                  key={day}
                  onClick={() => handleSelectDate(day)}
                  className={`py-1 rounded-full hover:bg-gray-2 cursor-pointer
                    ${isSelected ? "bg-blue-600 text-white" : ""}
                  `}
                >
                  {day}
                </button>
              )
            })}
          </div>

        </div>
      )}
    </div>
  )
}

export default SingleDatePicker
