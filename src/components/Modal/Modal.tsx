import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
  open: boolean
  title: string
  subTitle?: string
  closeModal: () => void
  children: ReactNode
}

export default function Modal({
  open,
  title,
  subTitle,
  closeModal,
  children
}: ModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const prevIsOpen = useRef<boolean>()

  useEffect(() => {
    const keyboardHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal()
    }

    document.addEventListener("keydown", keyboardHandler)

    return () => {
      document.removeEventListener("keydown", keyboardHandler)
    }
  }, [closeModal])

  useLayoutEffect(() => {
    if (!open && prevIsOpen.current) {
      setIsClosing(true)
    }

    prevIsOpen.current = open
  }, [open])
  
  if (!open && !isClosing) return null
  return createPortal(
    <div
      className={`modal ${isClosing ? "closing" : ""}`}
      onAnimationEnd={() => setIsClosing(false)}
    >
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
    </div>,
    document.querySelector<HTMLDivElement>("#modal-wrapper")!
  )
}
