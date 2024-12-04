import Modal from "./Modal"
import { format } from "date-fns"
import { FormEvent, Fragment, useId, useRef, useState } from "react"
import { useCalendar } from "../../contexts/CalendarContext"
import { Event, EVENT_COLOR, EventColor } from "../CalendarEvents/CalendarEvent"
import { Day } from "../Calendar/Days/CalendarDays"

type InputStringType = "name" | "startTime" | "endTime" | "color"
type InputBooleanType = "isAllDay"
type InputType = InputStringType | InputBooleanType

type InputValueType = {
  [key in Exclude<InputStringType, "color">]: string
} & {
  [key in InputBooleanType]: boolean
} & { color: EventColor }

type AddEventModalProps = {
  day: Day
  event?: Event
  open: boolean
  toggle: () => void
}

export default function AddEventModal({
  day,
  event,
  open,
  toggle
}: AddEventModalProps) {
  const { addEvent, editEvent, removeEvent } = useCalendar()
  const subTitle = day ? format(day.date, "dd/MM/yy") : ""
  const isNew = event == null

  const formId = useId()
  const endTimeInputRef = useRef<HTMLInputElement>(null)
  const [inputValue, setInputValue] = useState<InputValueType>({
    name: event ? event.eventName : "",
    isAllDay: event ? event.isAllDay : false,
    startTime: !event || event?.isAllDay ? "" : event.eventStartTime,
    endTime: !event || event.isAllDay ? "" : event.eventEndTime,
    color: event ? event.eventColor : EVENT_COLOR[0]
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

  const resetInputForm = () => {
    setInputValue({
      name: "",
      isAllDay: false,
      startTime: "",
      endTime: "",
      color: EVENT_COLOR[0]
    })
  }

  const saveEvent = (e: FormEvent) => {
    e.preventDefault()

    if (!inputValue.name || !inputValue.color) return

    if (isNew) {
      addEvent(
        day.date,
        inputValue.isAllDay
          ? {
              eventName: inputValue.name,
              eventColor: inputValue.color,
              isAllDay: inputValue.isAllDay
            }
          : {
              eventName: inputValue.name,
              eventColor: inputValue.color,
              isAllDay: inputValue.isAllDay,
              eventEndTime: inputValue.endTime,
              eventStartTime: inputValue.startTime
            }
      )
      toggle()
      resetInputForm()
      return
    }

    editEvent(
      day.date,
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
  }

  const deleteEvent = () => {
    if (!event) return
    toggle()
    setTimeout(()=>{
      removeEvent(day.date, event)
    }, 250)
  }

  return (
    <Modal
      title={!isNew ? "Edit Event" : "Add Event"}
      subTitle={subTitle}
      open={open}
      closeModal={toggle}
    >
      <form onSubmit={saveEvent}>
        <div className="form-group">
          <label htmlFor={`${formId}-name`}>Name</label>
          <input
            onChange={(e) => inputChange(e.target.value, "name")}
            value={inputValue.name}
            type="text"
            id={`${formId}-name`}
            required
          />
        </div>
        <div className="form-group checkbox">
          <input
            onChange={(e) => inputChange(e.target.checked, "isAllDay")}
            checked={inputValue.isAllDay}
            type="checkbox"
            id={`${formId}-all-day`}
          />
          <label htmlFor={`${formId}-all-day`}>All Day?</label>
        </div>
        <div className="row">
          <div className="form-group">
            <label htmlFor={`${formId}-start-time`}>Start Time</label>
            <input
              disabled={inputValue.isAllDay}
              required={!inputValue.isAllDay}
              onChange={(e) => inputChange(e.target.value, "startTime")}
              value={inputValue.startTime}
              type="time"
              id={`${formId}-start-time`}
            />
          </div>
          <div className="form-group">
            <label htmlFor={`${formId}-end-time`}>End Time</label>
            <input
              disabled={inputValue.isAllDay}
              required={!inputValue.isAllDay}
              min={inputValue.startTime}
              onChange={(e) => inputChange(e.target.value, "endTime")}
              value={inputValue.endTime}
              type="time"
              id={`${formId}-end-time`}
              ref={endTimeInputRef}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Color</label>
          <div className="row left">
            {EVENT_COLOR.map((color) => (
              <Fragment key={color}>
                <input
                  onChange={(e) => inputChange(e.target.value, "color")}
                  type="radio"
                  name="color"
                  value={color}
                  id={`${formId}-${color}`}
                  checked={inputValue.color === color}
                  className="color-radio"
                />
                <label htmlFor={`${formId}-${color}`}>
                  <span className="sr-only">{color}</span>
                </label>
              </Fragment>
            ))}
          </div>
        </div>
        <div className="row">
          <button className="btn btn-success" type="submit">
            {!isNew ? "Save" : "Add"}
          </button>
          {!isNew && (
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
