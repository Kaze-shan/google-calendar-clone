import { useState } from "react"

type UseToggleProps = {
    defaultValue?: boolean
}

export default function useToggle({defaultValue = false}: UseToggleProps = {}) {
    const [open, setOpen] = useState(defaultValue)

    const toggle = () => {
        setOpen(prev => !prev)
    }

    return {open, toggle}
}