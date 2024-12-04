import { format } from "date-fns"
import { Day } from "../Calendar/Days/CalendarDays"
import useToggle from "../../hooks/useToggle"
import AddEventModal from "../Modal/AddEventModal"

export const EVENT_COLOR = ["red", "green", "blue"] as const
export type EventColor = (typeof EVENT_COLOR)[number]
export type Event =
  | {
      id: string
      eventName: string
      isAllDay: true
      eventColor: EventColor
      eventStartTime?: never
      eventEndTime?: never
    }
  | {
      id: string
      eventName: string
      isAllDay: false
      eventColor: EventColor
      eventStartTime: string
      eventEndTime: string
    }

type EventProps = {
  calendarEvent: Event
  day: Day
}

export default function CalendarEvent({ calendarEvent, day }: EventProps) {
  const { open: openEventModal, toggle: toggleEventModal } = useToggle()
  const [hour, min] = calendarEvent.isAllDay
    ? ["00", "00"]
    : calendarEvent.eventStartTime.split(":")
  const eventStartTime = format(
    new Date(0, 0, 0, parseInt(hour), parseInt(min)),
    "p"
  )

  return (
    <>
      {calendarEvent.isAllDay ? (
        <button
          onClick={toggleEventModal}
          className={`all-day-event ${calendarEvent.eventColor} event`}
        >
          <div className="event-name">{calendarEvent.eventName}</div>
        </button>
      ) : (
        <button onClick={toggleEventModal} className="event">
          <div className={`color-dot ${calendarEvent.eventColor}`}></div>
          <div className="event-time">{eventStartTime}</div>
          <div className="event-name">{calendarEvent.eventName}</div>
        </button>
      )}
      <AddEventModal
        day={day}
        event={calendarEvent}
        open={openEventModal}
        toggle={toggleEventModal}
      />
    </>
  )
}
