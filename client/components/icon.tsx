import { icons, LucideProps } from 'lucide-react'

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: keyof typeof icons
}

const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name]

  return LucideIcon ? <LucideIcon size={20} {...props} /> : null
}

export default Icon
