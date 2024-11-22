import { format, isBefore, isSameMonth, isToday } from "date-fns"
import CalendarEvents from "../../CalendarEvents/CalendarEvents"
import type { Day } from "./CalendarDays"
import { MODAL_TYPE, useModal } from "../../contexts/ModalContext"

type DayProps = {
  day: Day
  currentTime: Date
}

export default function CalendarDay({ day, currentTime }: DayProps) {
  const { setModalMode } = useModal()
  const isCurrentMonthDay = isSameMonth(day.date, currentTime)
  const isBeforeToday = isBefore(day.date, new Date()) && !isToday(day.date)
  const isCalendarDayToday = isToday(day.date)
  const weekName = format(day.date, "eee")
  const dayNumber = format(day.date, "d")

  const addEvent = () => {
    setModalMode(MODAL_TYPE.EVENT, day)
  }

  return (
    <div
      className={`day ${isCurrentMonthDay ? "" : "non-month-day"} ${
        isBeforeToday ? "old-month-day" : ""
      }`}
    >
      <div className="day-header">
        <div className="week-name">{weekName}</div>
        <div className={`day-number ${isCalendarDayToday ? "today" : ""}`}>
          {dayNumber}
        </div>
        <button className="add-event-btn" onClick={addEvent}>
          +
        </button>
      </div>
      <CalendarEvents day={day} events={day.events} />
    </div>
  )
}
