import { endOfDay, format, isBefore, isSameMonth, isToday } from "date-fns"
import type { Day } from "./CalendarDays"
import useToggle from "../../../hooks/useToggle"
import DisplayDayEventModal from "../../Modal/DisplayDayEventModal"
import AddEventModal from "../../Modal/AddEventModal"
import { OverflowContainer } from "../../Common/OverflowContainer"
import CalendarEvent, { Event } from "../../CalendarEvents/CalendarEvent"

type DayProps = {
  day: Day
  currentTime: Date
  displayWeekName: boolean
}

export default function CalendarDay({
  day,
  currentTime,
  displayWeekName
}: DayProps) {
  const {
    open: openDisplayAllEventsModal,
    toggle: toggleDisplayAllEventsModal
  } = useToggle()
  const { open: openAddEventModal, toggle: toggleAddEventModal } = useToggle()
  const isCurrentMonthDay = isSameMonth(day.date, currentTime)
  const isBeforeToday = isBefore(endOfDay(day.date), new Date())
  const isCalendarDayToday = isToday(day.date)
  const weekName = format(day.date, "eee")
  const dayNumber = format(day.date, "d")

  const getKey = (item: Event) => {
    return item.id
  }

  return (
    <div
      className={`day ${isCurrentMonthDay ? "" : "non-month-day"} ${
        isBeforeToday ? "old-month-day" : ""
      }`}
    >
      <div className="day-header">
        {displayWeekName && <div className="week-name">{weekName}</div>}
        <div className={`day-number ${isCalendarDayToday ? "today" : ""}`}>
          {dayNumber}
        </div>
        <button className="add-event-btn" onClick={toggleAddEventModal}>
          +
        </button>
      </div>
      <OverflowContainer
        className="events"
        items={day.events}
        renderItem={(item) => <CalendarEvent day={day} calendarEvent={item} />}
        getKey={getKey}
        renderOverflow={(count) => (
          <button
            onClick={toggleDisplayAllEventsModal}
            className="events-view-more-btn"
          >
            +{count} More
          </button>
        )}
      />
      <DisplayDayEventModal
        day={day}
        open={openDisplayAllEventsModal}
        onClose={toggleDisplayAllEventsModal}
      />
        <AddEventModal
          day={day}
          open={openAddEventModal}
          toggle={toggleAddEventModal}
        />
    </div>
  )
}
