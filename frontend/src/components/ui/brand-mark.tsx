interface BrandMarkProps {
  size?: number
}

const BRAND_LOGO_URL = 'https://cdn-icons-png.flaticon.com/128/12341/12341570.png'

export function BrandMark({ size = 30 }: BrandMarkProps) {
  return (
    <span aria-hidden="true" className="brand-mark" style={{ width: size, height: size }}>
      <img alt="" src={BRAND_LOGO_URL} />
    </span>
  )
}
