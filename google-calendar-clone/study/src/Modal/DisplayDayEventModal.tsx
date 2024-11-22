import Modal from './Modal'
import { useModal } from '../contexts/ModalContext'
import CalendarEvents from '../CalendarEvents/CalendarEvents'

export default function DisplayDayEventModal() {

  const {dayInfo, toggle} = useModal()

  return (
    dayInfo &&
    <Modal title='test' closeModal={toggle}>
      <CalendarEvents day={dayInfo} events={dayInfo.events}/>
    </Modal>
  )
}
