import { ReactNode } from "react"
import { useModal } from "../contexts/ModalContext"

type ModalProps = {
  title: string
  closeModal: () => void
  children: ReactNode
}

export default function Modal({ title, closeModal, children }: ModalProps) {
  const {toggle} = useModal()
  return (
    <div className="modal">
      <div className="overlay" onClick={toggle}></div>
      <div className="modal-body">
        <div className="modal-title">
          {title}
          <button className="close-btn" onClick={closeModal}>
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
