import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import SelectionButton from './SelectionButton'

export default function ModelCard({ model }) {
  const mainImage = model.model_images?.[0]?.image_url || model.image_url || ''
  const categoryName = model.categories?.name || ''

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1 animate-fade-in">
      <Link to={`/models/${model.id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={model.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-50 to-gold-100">
              <span className="text-gold-300 text-4xl">🏠</span>
            </div>
          )}
          {categoryName && (
            <span className="absolute top-3 right-3 bg-navy-900/80 backdrop-blur-sm text-white text-xs font-cairo px-3 py-1 rounded-full">
              {categoryName}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/models/${model.id}`}>
          <h3 className="font-cairo font-bold text-navy-900 text-lg mb-1 hover:text-gold-600 transition-colors line-clamp-1">
            {model.name}
          </h3>
        </Link>
        {model.description && (
          <p className="text-gray-500 text-sm font-cairo line-clamp-2 mb-4 leading-relaxed">
            {model.description}
          </p>
        )}

        <div className="flex items-center gap-2">
          <SelectionButton model={model} size="sm" className="flex-1 justify-center" />
          <Link
            to={`/models/${model.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-cairo font-semibold text-navy-700 hover:text-gold-600 border border-gray-200 hover:border-gold-300 rounded-xl transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            عرض
          </Link>
        </div>
      </div>
    </div>
  )
}
