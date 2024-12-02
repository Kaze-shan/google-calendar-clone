import { format, isBefore, isSameMonth, isToday } from "date-fns"
import CalendarEvents from "../../CalendarEvents/CalendarEvents"
import type { Day } from "./CalendarDays"
import { MODAL_TYPE, useModal } from "../../contexts/ModalContext"
import { useState } from "react"

type DayProps = {
  day: Day
  currentTime: Date
}

export default function CalendarDay({ day, currentTime }: DayProps) {
  const { setModalMode } = useModal()
  const [showMoreCount, setShowMoreCount] = useState(0)
  const isCurrentMonthDay = isSameMonth(day.date, currentTime)
  const isBeforeToday = isBefore(day.date, new Date()) && !isToday(day.date)
  const isCalendarDayToday = isToday(day.date)
  const weekName = format(day.date, "eee")
  const dayNumber = format(day.date, "d")

  const addEvent = () => {
    setModalMode(MODAL_TYPE.EVENT, day)
  }

  const openAllEventsModal = () => {
    setModalMode(MODAL_TYPE.DAY, day)
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
      <CalendarEvents day={day} events={day.events} showMoreCount={showMoreCount} setShowMoreCount={setShowMoreCount}/>
      {
        showMoreCount?
        <button onClick={openAllEventsModal} className="events-view-more-btn">+{showMoreCount} More</button> : <></>
      }
    </div>
  )
}
