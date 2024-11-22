import { Day } from "../Calendar/Days/CalendarDays";
import { MODAL_TYPE, useModal } from "../contexts/ModalContext";
import type { Event } from "./CalendarEvent";
import CalendarEvent from "./CalendarEvent";

type EventsProps = {
  day: Day
  events: Event[]
};

export default function CalendarEvents({ day, events }: EventsProps) {

  const {setModalMode} = useModal()

  const editEvent = (event: Event) => {
    setModalMode( MODAL_TYPE.EVENT, day, event)
  }

  return (
    <div className="events">
      {events.map((evt, idx) => (
        <CalendarEvent key={idx} calendarEvent={evt} editEvent={editEvent}/>
      ))}
    </div>
  );
}
