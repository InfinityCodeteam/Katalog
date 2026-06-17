import { ShoppingBag, Check } from 'lucide-react'
import { useSelection } from '../../contexts/SelectionContext'

export default function SelectionButton({ model, size = 'md', className = '' }) {
  const { addItem, removeItem, isSelected } = useSelection()
  const selected = isSelected(model.id)

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (selected) {
      removeItem(model.id)
    } else {
      addItem(model)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center font-cairo font-semibold rounded-xl transition-all duration-300
        ${sizes[size]}
        ${selected
          ? 'bg-green-500 hover:bg-red-500 text-white shadow-md'
          : 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold hover:shadow-gold-lg'
        }
        ${className}
      `}
    >
      {selected ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
      {selected ? 'تمت الإضافة' : 'أضف للاختيار'}
    </button>
  )
}
