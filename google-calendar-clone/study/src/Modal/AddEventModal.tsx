import Modal from "./Modal"
import { useModal } from "../contexts/ModalContext"
import { format } from "date-fns"
import { FormEvent, useRef, useState } from "react"
import { useCalendar } from "../contexts/CalendarContext"
import { EVENT_COLOR, EventColor } from "../CalendarEvents/CalendarEvent"

type InputStringType = "name" | "startTime" | "endTime" | "color"
type InputBooleanType = "isAllDay"
type InputType = InputStringType | InputBooleanType

type InputValueType = {
  [key in Exclude<InputStringType, "color">]: string
} & {
  [key in InputBooleanType]: boolean
} & { color: EventColor }

export default function AddEventModal() {
  const { dayInfo, event, toggle } = useModal()
  const { addEvent, editEvent, removeEvent } = useCalendar()
  const subTitle = dayInfo ? format(dayInfo.date, "dd/MM/yy") : ""
  const endTimeInputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState<InputValueType>({
    name: event ? event.eventName : "",
    isAllDay: event ? event.isAllDay : false,
    startTime: !event || event?.isAllDay ? "" : event.eventStartTime,
    endTime: !event || event.isAllDay ? "" : event.eventEndTime,
    color: event ? event.eventColor : "blue"
  })

  const inputChange = (value: string | boolean, type: InputType) => {
    endTimeInputRef.current?.setCustomValidity("")
    const newInputValueObj = { ...inputValue }
    switch (type) {
      case "isAllDay":
        newInputValueObj[`${type}`] = !!value
        newInputValueObj.startTime = ""
        newInputValueObj.endTime = ""
        break
      case "color":
        if (!EVENT_COLOR.some((color) => color === inputValue.color)) return
        newInputValueObj[`${type}`] = value as EventColor
        break
      default:
        newInputValueObj[`${type}`] = value.toString()
    }
    setInputValue(newInputValueObj)
  }

  const saveEvent = (e: FormEvent) => {
    e.preventDefault()

    if (!dayInfo || !inputValue.name || !inputValue.color) return false

    if (!inputValue.isAllDay && !(inputValue.startTime && inputValue.endTime)) {
      endTimeInputRef.current?.setCustomValidity(
        "Please Input the start end time for non all day event"
      )
      endTimeInputRef.current?.reportValidity()
      return false
    }

    if (!inputValue.isAllDay && inputValue.startTime && inputValue.endTime) {
      const [startHour, startMin] = inputValue.startTime.split(":")
      const [endHour, endMin] = inputValue.endTime.split(":")
      const startTimeDate = new Date(
        0,
        0,
        0,
        parseInt(startHour),
        parseInt(startMin)
      )
      const endTimeDate = new Date(0, 0, 0, parseInt(endHour), parseInt(endMin))
      if (endTimeDate < startTimeDate) {
        endTimeInputRef.current?.setCustomValidity(
          `Value must be ${format(startTimeDate, "h:mm bbb")} or later`
        )
        endTimeInputRef.current?.reportValidity()
        return false
      }
    }

    if (event) {
      editEvent(
        dayInfo.date,
        inputValue.isAllDay
          ? {
              id: event.id,
              eventName: inputValue.name,
              eventColor: inputValue.color,
              isAllDay: inputValue.isAllDay
            }
          : {
              id: event.id,
              eventName: inputValue.name,
              eventColor: inputValue.color,
              isAllDay: inputValue.isAllDay,
              eventEndTime: inputValue.endTime,
              eventStartTime: inputValue.startTime
            }
      )
      toggle()
      return
    }

    addEvent(
      dayInfo.date,
      inputValue.isAllDay
        ? {
            id: crypto.randomUUID(),
            eventName: inputValue.name,
            eventColor: inputValue.color,
            isAllDay: inputValue.isAllDay
          }
        : {
            id: crypto.randomUUID(),
            eventName: inputValue.name,
            eventColor: inputValue.color,
            isAllDay: inputValue.isAllDay,
            eventEndTime: inputValue.endTime,
            eventStartTime: inputValue.startTime
          }
    )
    toggle()
  }

  const deleteEvent = () => {
    if (!dayInfo || !event) return
    removeEvent(dayInfo.date, event)
    toggle()
  }

  return (
    <Modal title={event? 'Edit Event': 'Add Event'} subTitle={subTitle} closeModal={toggle}>
      <form onSubmit={saveEvent}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            onChange={(e) => inputChange(e.target.value, "name")}
            value={inputValue.name}
            type="text"
            name="name"
            id="name"
            required
          />
        </div>
        <div className="form-group checkbox">
          <input
            onChange={(e) => inputChange(e.target.checked, "isAllDay")}
            checked={inputValue.isAllDay}
            type="checkbox"
            name="all-day"
            id="all-day"
          />
          <label htmlFor="all-day">All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor="start-time">Start Time</label>
            <input
              disabled={inputValue.isAllDay}
              onChange={(e) => inputChange(e.target.value, "startTime")}
              value={inputValue.startTime}
              type="time"
              name="start-time"
              id="start-time"
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-time">End Time</label>
            <input
              disabled={inputValue.isAllDay}
              onChange={(e) => inputChange(e.target.value, "endTime")}
              value={inputValue.endTime}
              type="time"
              name="end-time"
              id="end-time"
              ref={endTimeInputRef}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            <input
              onChange={(e) => inputChange(e.target.value, "color")}
              type="radio"
              name="color"
              value="blue"
              id="blue"
              checked={inputValue.color === "blue"}
              className="color-radio"
            />
            <label htmlFor="blue">
              <span className="sr-only">Blue</span>
            </label>
            <input
              onChange={(e) => inputChange(e.target.value, "color")}
              type="radio"
              name="color"
              value="red"
              id="red"
              checked={inputValue.color === "red"}
              className="color-radio"
            />
            <label htmlFor="red">
              <span className="sr-only">Red</span>
            </label>
            <input
              onChange={(e) => inputChange(e.target.value, "color")}
              type="radio"
              name="color"
              value="green"
              id="green"
              checked={inputValue.color === "green"}
              className="color-radio"
            />
            <label htmlFor="green">
              <span className="sr-only">Green</span>
            </label>
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            {event ? "Save" : "Add"}
          </button>
          {event && (
            <button
              onClick={deleteEvent}
              className="btn btn-delete"
              type="button"
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}
