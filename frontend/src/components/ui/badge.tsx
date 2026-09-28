import type { HTMLAttributes } from 'react'

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning'

export function Badge({
  children,
  className = '',
  tone = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span className={`badge badge--${tone} ${className}`.trim()} {...props}>
      {children}
    </span>
  )
}
