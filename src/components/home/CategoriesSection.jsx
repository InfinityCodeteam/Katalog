import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const CATEGORY_ICONS = ['🪟', '✨', '🏠', '🛏️', '🌟', '💎', '🎨', '🌿']
const CATEGORY_COLORS = [
  'from-gold-400 to-gold-600',
  'from-navy-600 to-navy-800',
  'from-purple-400 to-purple-600',
  'from-teal-400 to-teal-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
  'from-indigo-400 to-indigo-600',
  'from-emerald-400 to-emerald-600',
]

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
            <Link key={cat.id} to={`/models?category=${cat.id}`}
              className="group relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer hover:-translate-y-1 transition-all duration-300 shadow-card hover:shadow-card-hover animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="absolute inset-0 bg-hero-pattern opacity-20" />
              <div className="relative z-10">
                <div className="text-4xl mb-3">{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</div>
                <h3 className="font-cairo font-bold text-white text-base">{cat.name}</h3>
                <div className="mt-3 flex items-center justify-center gap-1 text-white/70 text-xs font-cairo group-hover:text-white transition-colors">
                  <span>تصفح</span>
                  <ChevronLeft className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
