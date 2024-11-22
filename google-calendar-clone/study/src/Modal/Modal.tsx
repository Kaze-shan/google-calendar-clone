import { ReactNode } from "react"
import { useModal } from "../contexts/ModalContext"

type ModalProps = {
  title: string
  subTitle?: string
  closeModal: () => void
  children: ReactNode
}

export default function Modal({ title, subTitle, closeModal, children }: ModalProps) {
  const {toggle} = useModal()
  return (
    <div className="modal">
      <div className="overlay" onClick={toggle}></div>
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
