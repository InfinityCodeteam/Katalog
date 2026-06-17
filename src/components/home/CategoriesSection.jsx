import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const FALLBACK_GRADIENTS = [
  'from-gold-400 to-gold-600',
  'from-navy-600 to-navy-800',
  'from-purple-400 to-purple-600',
  'from-teal-400 to-teal-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
  'from-indigo-400 to-indigo-600',
  'from-emerald-400 to-emerald-600',
]

const FALLBACK_ICONS = ['🪟', '✨', '🏠', '🛏️', '🌟', '💎', '🎨', '🌿']

export default function CategoriesSection() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    supabase.from('categories').select('*').order('name')
      .then(({ data }) => setCategories(data || []))
  }, [])

  if (!categories.length) return null

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-gold-500 font-cairo font-semibold text-sm mb-3 tracking-wider uppercase">
            تصفح حسب الفئة
          </span>
          <h2 className="font-cairo font-black text-3xl md:text-4xl text-navy-900 mb-3">
            فئات الستائر
          </h2>
          <div className="w-16 h-1 bg-gold-gradient mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={`/models?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover animate-fade-in aspect-[3/4]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              {/* Background: real image or gradient fallback */}
              {cat.image_url ? (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length]}`} />
              )}

              {/* Dark overlay — stronger at bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent group-hover:from-navy-950/70 transition-all duration-300" />

              {/* Fallback icon when no image */}
              {!cat.image_url && (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <span className="text-6xl">{FALLBACK_ICONS[i % FALLBACK_ICONS.length]}</span>
                </div>
              )}

              {/* Content at bottom */}
              <div className="absolute bottom-0 right-0 left-0 p-4">
                <h3 className="font-cairo font-bold text-white text-base leading-tight mb-1">
                  {cat.name}
                </h3>
                <div className="flex items-center gap-1 text-white/60 text-xs font-cairo group-hover:text-gold-300 transition-colors">
                  <span>تصفح الموديلات</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>

              {/* Gold border shine on hover */}
              <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 group-hover:ring-gold-400/50 transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
