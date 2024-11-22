import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CalendarProvider } from './contexts/CalendarContext.tsx'
import { ModalProvider } from './contexts/ModalContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CalendarProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </CalendarProvider>
  </StrictMode>,
)
