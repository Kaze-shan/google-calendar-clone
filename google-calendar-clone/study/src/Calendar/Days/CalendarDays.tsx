import {
  addDays,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isSaturday,
  isSunday,
  nextSaturday,
  previousSunday,
  startOfMonth
} from "date-fns"
import CalendarDay from "./CalendarDay"
import { Event } from "../../CalendarEvents/CalendarEvent"
import { useCalendar } from "../../contexts/CalendarContext"
import { useEffect, useState } from "react"

type DaysProps = {
  currentTime: Date
}

export type Day = {
  date: Date
  events: Event[]
}

export default function CalendarDays({ currentTime }: DaysProps) {

  const { calendarDays } = useCalendar()
  const [dayList, setDayList] = useState<Day[]>([])

  const getDaysList = () => {
    const startDay = startOfMonth(currentTime)
    const endDay = endOfMonth(currentTime)
    let start = isSunday(startDay) ? startDay : previousSunday(startDay)
    let end = isSaturday(endDay) ? endDay : nextSaturday(endDay)
    let currentDaysList: Day[] = []

    while (differenceInCalendarDays(end, start) >= 0) {
      const dayKey = format(start, "dd/MM/yy")
      if (calendarDays[`${dayKey}`]) {
        currentDaysList.push(calendarDays[`${dayKey}`])
      } else {
        currentDaysList.push({
          date: start,
          events: []
        })
      }

      start = addDays(start, 1)
    }
    return currentDaysList
  }

  useEffect(() => {
    setDayList(getDaysList())
  }, [calendarDays, currentTime])


  return (
    <div className="days">
      {dayList.map((day) => (
        <CalendarDay
          key={day.date.toISOString()}
          day={day}
          currentTime={currentTime}
        />
      ))}
    </div>
  )
}
