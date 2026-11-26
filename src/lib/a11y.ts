import type { KeyboardEvent } from 'react'

/** Enter/Space handler for non-button elements with role="button" (SVG regions). */
export const onKeyActivate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    fn()
  }
}
