import { useState, type ImgHTMLAttributes } from 'react'

type Presence = 'online' | 'away' | 'offline'

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt' | 'src'> {
  name: string
  size?: 'sm' | 'md' | 'lg'
  src?: string
  presence?: Presence
}

const avatarGradients = ['plum', 'ocean', 'sunset', 'mint', 'berry'] as const

function gradientForName(name: string) {
  const hash = [...name].reduce((value, character) => value + character.charCodeAt(0), 0)
  return avatarGradients[hash % avatarGradients.length]
}

export function Avatar({ className = '', name, presence, size = 'md', src, ...props }: AvatarProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

  return (
    <span
      className={`avatar avatar--${size} avatar--${gradientForName(name)} ${className}`.trim()}
      aria-label={`${name}${presence ? `, ${presence}` : ''}`}
      role="img"
    >
      {src && !imageFailed ? (
        <img alt="" onError={() => setImageFailed(true)} src={src} {...props} />
      ) : (
        initials || '?'
      )}
      {presence && (
        <span
          aria-label={presence}
          className={`avatar__presence avatar__presence--${presence}`}
        />
      )}
    </span>
  )
}
