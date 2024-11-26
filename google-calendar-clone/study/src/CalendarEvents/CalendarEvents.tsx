import { useEffect, useRef } from "react"
import { Day } from "../Calendar/Days/CalendarDays"
import { MODAL_TYPE, useModal } from "../contexts/ModalContext"
import type { Event } from "./CalendarEvent"
import CalendarEvent from "./CalendarEvent"
import useWindowSize from "../hooks/useWindowSize"

type EventsProps = {
  day: Day
  events: Event[]
  showMoreCount?: number
  setShowMoreCount?: React.Dispatch<React.SetStateAction<number>>
}

export default function CalendarEvents({
  day,
  events,
  showMoreCount,
  setShowMoreCount
}: EventsProps) {
  const { setModalMode } = useModal()
  const { height } = useWindowSize()
  const eventRef = useRef<HTMLDivElement>(null)

  const editEvent = (event: Event) => {
    setModalMode(MODAL_TYPE.EVENT, day, event)
  }

  const getNumberOfEventsDisplay = (divHeight: number, totalEvents: number) => {
    const EVENT_HEIGHT = 27.3
    const GAP = 8
    let numberOfEventsDisplayOnScreen = 0
    for (let i = 0; i < totalEvents; i++) {
      if (divHeight >= EVENT_HEIGHT) {
        divHeight -= EVENT_HEIGHT

        divHeight -= GAP

        numberOfEventsDisplayOnScreen++
        if (divHeight <= EVENT_HEIGHT) {
          break
        }
      }
    }
    return numberOfEventsDisplayOnScreen + divHeight / EVENT_HEIGHT
  }

  const calculateShowMoreCount = () => {
    if (!eventRef.current || !setShowMoreCount) return

    const height = eventRef.current.clientHeight
    const SHOW_MORE_HEIGHT = 20.5

    const eventsVisibleOnScreen = getNumberOfEventsDisplay(
      height,
      events.length
    )
    const lastElementVisibleOnScreen =
        eventsVisibleOnScreen % 1 > 0.4 ? 1 : 0
    if (Math.floor(eventsVisibleOnScreen) + lastElementVisibleOnScreen < events.length) {
      const eventsVisibleOnScreenWithShowMoreBtn = getNumberOfEventsDisplay(
        showMoreCount? height : height - SHOW_MORE_HEIGHT,
        events.length
      )
      const lastElementVisibleOnScreen =
        eventsVisibleOnScreenWithShowMoreBtn % 1 > 0.4 ? 1 : 0
      const eventsOnScreen =
        Math.floor(eventsVisibleOnScreenWithShowMoreBtn) +
        lastElementVisibleOnScreen
      setShowMoreCount(events.length - eventsOnScreen)
      return
    }
  }

  useEffect(() => {
    if (!setShowMoreCount) return
    calculateShowMoreCount()
  }, [events, height])

  return (
    <div className="events" ref={eventRef}>
      {events.map((evt, idx) => (
        <CalendarEvent key={idx} calendarEvent={evt} editEvent={editEvent} />
      ))}
    </div>
  )
}
