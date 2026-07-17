import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Determine initially inside effect asynchronously to avoid hydration mismatch
    const isM = window.innerWidth < MOBILE_BREAKPOINT
    setTimeout(() => {
      setIsMobile(isM)
    }, 0)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
