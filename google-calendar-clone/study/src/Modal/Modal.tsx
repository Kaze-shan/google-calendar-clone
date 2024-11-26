import { ReactNode } from "react"
import { useModal } from "../contexts/ModalContext"

type ModalProps = {
  title: string
  subTitle?: string
  closeModal: () => void
  children: ReactNode
}

export default function Modal({ title, subTitle, closeModal, children }: ModalProps) {

  const {triggerCloseAnimation} = useModal()

  return (
    <div className={triggerCloseAnimation? "modal closing" : "modal"} >
      <div className="overlay" onClick={closeModal}></div>
      <div className="modal-body">
        <div className="modal-title">
          <div>{title}</div>
          <small>{subTitle}</small>
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
