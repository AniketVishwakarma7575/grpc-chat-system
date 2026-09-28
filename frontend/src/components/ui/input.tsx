import type { InputHTMLAttributes, Ref } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  inputRef?: Ref<HTMLInputElement>
}

export function Input({ className = '', hint, id, inputRef, label, ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <label className="field" htmlFor={inputId}>
      {label && <span className="field__label">{label}</span>}
      <input className={`input ${className}`.trim()} id={inputId} ref={inputRef} {...props} />
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  )
}
