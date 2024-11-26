import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react"
import type { Day } from "../Calendar/Days/CalendarDays"
import { Event } from "../CalendarEvents/CalendarEvent"
import { format, isBefore } from "date-fns"

type CalendarContextType = {
  calendarDays: CalendarDays
  addEvent: (date: Date, newEvent: Event) => void
  editEvent: (date: Date, updateEvent: Event) => void
  removeEvent: (date: Date, removeEvent: Event) => void
}

type CalendarDays = {
  [key: string]: Day
}

const CALENDAR_DAYS = "CALENDAR_DAYS"

const CalendarContext = createContext<CalendarContextType | null>(null)

export function useCalendar() {
  const calendarContext = useContext(CalendarContext)
  if (calendarContext == null) {
    throw new Error("Must use within Provider")
  }

  return calendarContext
}

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [calendarDays, setCalendarDays] = useState<CalendarDays>({})

  useEffect(() => {
    const retriveCalendarFromLocalStorage = () => {
      const calendarDays = localStorage.getItem(CALENDAR_DAYS)
      if (calendarDays) {
        const calendarDaysObj = JSON.parse(calendarDays) as CalendarDays
        for (const key in calendarDaysObj) {
          calendarDaysObj[key].date = new Date(calendarDaysObj[key].date)
        }
        setCalendarDays(calendarDaysObj)
      }
    }

    retriveCalendarFromLocalStorage()
  }, [])

  const updateCalendarDays = (newCalendarDays: CalendarDays) => {
    localStorage.setItem(CALENDAR_DAYS, JSON.stringify(newCalendarDays))
    setCalendarDays(newCalendarDays)
  }

  const addEvent = (date: Date, newEvent: Event) => {
    const dayKey = format(date, "dd/MM/yy")
    const newCalendarDays = { ...calendarDays }

    if (!calendarDays[dayKey]) {
      newCalendarDays[`${dayKey}`] = { date: date, events: [newEvent] }
      updateCalendarDays(newCalendarDays)
      return
    }

    const allDayEvent = calendarDays[`${dayKey}`].events.filter(
      (event) => event.isAllDay
    )
    const nonAllDayEvent = calendarDays[`${dayKey}`].events.filter(
      (event) => !event.isAllDay
    )

    if (newEvent.isAllDay) {
      newCalendarDays[`${dayKey}`] = {
        date: date,
        events: [...allDayEvent, newEvent, ...nonAllDayEvent]
      }
      updateCalendarDays(newCalendarDays)
      return
    }

    const newNonAllDayEvent = [...nonAllDayEvent, newEvent].sort((a, b) => {
      const [aHour, aMin] = a.eventStartTime.split(":")
      const [bHour, bMin] = b.eventStartTime.split(":")
      const aDate = new Date(0, 0, 0, parseInt(aHour), parseInt(aMin))
      const bDate = new Date(0, 0, 0, parseInt(bHour), parseInt(bMin))
      return isBefore(aDate, bDate) ? -1 : 1
    })

    newCalendarDays[`${dayKey}`] = {
      date: date,
      events: [...allDayEvent, ...newNonAllDayEvent]
    }
    updateCalendarDays(newCalendarDays)
  }

  const editEvent = (date: Date, updateEvent: Event) => {
    const dayKey = format(date, "dd/MM/yy")
    const newCalendarDays = { ...calendarDays }

    if (calendarDays[dayKey]) {
      const newEvents = calendarDays[dayKey].events
      const editEventIndex = newEvents.findIndex(
        (event) => event.id === updateEvent.id
      )
      if (editEventIndex === -1) return
      newEvents[editEventIndex] = updateEvent
      updateCalendarDays(newCalendarDays)
    }
  }

  const removeEvent = (date: Date, deleteEvent: Event) => {
    const dayKey = format(date, "dd/MM/yy")
    const newCalendarDays = { ...calendarDays }

    if (calendarDays[dayKey]) {
      newCalendarDays[`${dayKey}`].events = newCalendarDays[
        `${dayKey}`
      ].events.filter((event) => event.id !== deleteEvent.id)
      updateCalendarDays(newCalendarDays)
      return
    }
  }

  return (
    <CalendarContext.Provider
      value={{ calendarDays, addEvent, editEvent, removeEvent }}
    >
      {children}
    </CalendarContext.Provider>
  )
}
