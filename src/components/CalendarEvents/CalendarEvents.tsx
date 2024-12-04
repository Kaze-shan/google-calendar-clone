import { Day } from "../Calendar/Days/CalendarDays"
import type { Event } from "./CalendarEvent"
import CalendarEvent from "./CalendarEvent"

type EventsProps = {
  day: Day
  events: Event[]
  showMoreCount?: number
  setShowMoreCount?: React.Dispatch<React.SetStateAction<number>>
}

export default function CalendarEvents({ day, events }: EventsProps) {
  return (
    <div className="events">
      {events.map((evt, idx) => (
        <CalendarEvent key={idx} day={day} calendarEvent={evt} />
      ))}
    </div>
  )
}
