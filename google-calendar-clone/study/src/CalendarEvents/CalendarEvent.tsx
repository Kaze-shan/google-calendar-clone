import { format } from "date-fns";
import { useModal } from "../contexts/ModalContext";

export const EVENT_COLOR = ["red", "green", "blue"] as const
export type EventColor = typeof EVENT_COLOR[number]
export type Event =
  | {
      id: string
      eventName: string;
      isAllDay: true;
      eventColor: EventColor;
    }
  | {
      id: string
      eventName: string;
      isAllDay: false;
      eventColor: EventColor;
      eventStartTime: string;
      eventEndTime: string
    };

type EventProps = {
    calendarEvent: Event
    editEvent: (event: Event) => void
};

export default function CalendarEvent({ calendarEvent, editEvent }: EventProps) {

  const [hour, min] = calendarEvent.isAllDay? ["00","00"]: calendarEvent.eventStartTime.split(":")
  const eventStartTime = format(new Date(0, 0, 0, parseInt(hour), parseInt(min)), "p")

  return calendarEvent.isAllDay ? (
    <button onClick={()=>editEvent(calendarEvent)} className={`all-day-event ${calendarEvent.eventColor} event`}>
      <div className="event-name">{calendarEvent.eventName}</div>
    </button>
  ) : (
      <button onClick={()=>editEvent(calendarEvent)} className="event">
        <div className={`color-dot ${calendarEvent.eventColor}`}></div>
        <div className="event-time">{eventStartTime}</div>
        <div className="event-name">{calendarEvent.eventName}</div>
      </button>
  );
}
