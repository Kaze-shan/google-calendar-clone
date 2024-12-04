import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react"
import { Event } from "../components/CalendarEvents/CalendarEvent"
import { format, isBefore } from "date-fns"
import { UnionOmit } from "../utils/types"
import { Day } from "../components/Calendar/Days/CalendarDays"

type CalendarContextType = {
  calendarDays: CalendarDays
  addEvent: (date: Date, newEvent: UnionOmit<Event, "id">) => void
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

  const sortEvents = (oldEvents: Event[]) => {
    const allDayEvent = oldEvents.filter((event) => event.isAllDay)
    const nonAllDayEvent = oldEvents.filter((event) => !event.isAllDay)

    const sortedNonAllDayEvent = nonAllDayEvent.sort((a, b) => {
      const [aHour, aMin] = a.eventStartTime.split(":")
      const [bHour, bMin] = b.eventStartTime.split(":")
      const aDate = new Date(0, 0, 0, parseInt(aHour), parseInt(aMin))
      const bDate = new Date(0, 0, 0, parseInt(bHour), parseInt(bMin))
      return isBefore(aDate, bDate) ? -1 : 1
    })

    return [...allDayEvent, ...sortedNonAllDayEvent]
  }

  const addEvent = (date: Date, newEvent: UnionOmit<Event, "id">) => {
    const dayKey = format(date, "dd/MM/yy")
    const newCalendarDays = { ...calendarDays }
    const newEventWithId: Event = { ...newEvent, id: crypto.randomUUID() }

    if (!calendarDays[dayKey]) {
      newCalendarDays[`${dayKey}`] = { date: date, events: [newEventWithId] }
      updateCalendarDays(newCalendarDays)
      return
    }

    const sortedEvents = sortEvents([
      ...newCalendarDays[`${dayKey}`].events,
      newEventWithId
    ])

    newCalendarDays[`${dayKey}`] = {
      date: date,
      events: sortedEvents
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
      newCalendarDays[dayKey].events = sortEvents(calendarDays[dayKey].events)
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
