import { MODAL_TYPE, useModal } from "../contexts/ModalContext";
import AddEventModal from "./AddEventModal";
import DisplayDayEventModal from "./DisplayDayEventModal";

export default function ModalWrapper() {

    const {mode, open} = useModal();

    const renderModal = () => {
        switch(mode) {
            case MODAL_TYPE.DAY:
                return <DisplayDayEventModal />
            case MODAL_TYPE.EVENT:
                return <AddEventModal />
            default:
                return <></>
        }
    }

  return ( open &&
    renderModal()
  )
}
