import Modal from './Modal'
import { Day } from '../Calendar/Days/CalendarDays'
import CalendarEvents from '../CalendarEvents/CalendarEvents'

type DisplayDayEventModalProps = {
  day: Day
  open: boolean
  onClose: () => void
}

export default function DisplayDayEventModal({day, open, onClose}: DisplayDayEventModalProps) {
  return (
    <Modal title='test' open={open} closeModal={onClose}>
      <CalendarEvents day={day} events={day.events}/>
    </Modal>
  )
}
