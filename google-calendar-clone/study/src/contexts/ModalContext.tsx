import {
  createContext,
  ReactNode,
  useContext,
  useState
} from "react"
import type { Day } from "../Calendar/Days/CalendarDays"
import type { Event } from "../CalendarEvents/CalendarEvent"
import useToggle from "../hooks/useToggle"

export const enum MODAL_TYPE {
  EVENT,
  DAY
}

type ModalContextType = {
    mode: MODAL_TYPE | null
    dayInfo: Day | null
    event: Event | null
    setModalMode: (mode: MODAL_TYPE,  day: Day, event?: Event) => void
    open: boolean
    toggle: ()=> void
    triggerCloseAnimation: boolean
}

const ModalContext = createContext<ModalContextType | null>(null)

export function useModal() {
  const modalContext = useContext(ModalContext)
  if (modalContext == null) {
    throw new Error("Must use within Provider")
  }

  return modalContext
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<MODAL_TYPE | null>(null)
  const [dayInfo, setDayInfo] = useState< Day | null>(null)
  const [event, setEvent] = useState< Event | null>(null)
  const {open, toggle} = useToggle()
  const [triggerCloseAnimation, setTriggerCloseAnimation] = useState(false)

  const setModalMode = (mode: MODAL_TYPE, day: Day, event?: Event) => {

    setMode(mode)

    setDayInfo(day)

    if(event)setEvent(event)

    toggle()
  }

  const closeModal = () => {

    setTriggerCloseAnimation(true)

    setTimeout(()=>{
      toggle()
      setTriggerCloseAnimation(false)
      setMode(null)
      setDayInfo(null)
      setEvent(null)
    }, 250)

  }

  return (
    <ModalContext.Provider value={{ mode, setModalMode, dayInfo, event, open, toggle: closeModal, triggerCloseAnimation }}>
      {children}
    </ModalContext.Provider>
  )
}
