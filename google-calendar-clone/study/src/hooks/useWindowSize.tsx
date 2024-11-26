import { useEffect, useState } from "react";

export default function useWindowSize() {
    const [width, setWidth] = useState(0)
    const [height, setHeight] = useState(0)

    const updateWindowSize = () => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight)
    }

    useEffect(() => {
      window.addEventListener("resize", updateWindowSize)
    
      return () => {
        window.removeEventListener("resize", updateWindowSize)
      }
    }, [])
    
    return {width, height}
}