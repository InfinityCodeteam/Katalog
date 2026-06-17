import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ModelCard from '../common/ModelCard'
import LoadingSpinner from '../common/LoadingSpinner'

export default function FeaturedModels() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('models')
      .select('*, categories(name), model_images(image_url)')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setModels(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block text-gold-500 font-cairo font-semibold text-sm mb-3 tracking-wider uppercase">
              أحدث الموديلات
            </span>
            <h2 className="font-cairo font-black text-3xl md:text-4xl text-navy-900 mb-3">
              الموديلات المميزة
            </h2>
            <div className="w-16 h-1 bg-gold-gradient rounded-full" />
          </div>
          <Link to="/models"
            className="hidden md:flex items-center gap-2 text-gold-600 hover:text-gold-700 font-cairo font-semibold text-sm transition-colors group">
            عرض الكل
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner size="lg" className="py-16" />
        ) : models.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-cairo">
            لا توجد موديلات متاحة حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 md:hidden">
          <Link to="/models"
            className="inline-flex items-center gap-2 bg-gold-gradient text-white px-6 py-3 rounded-xl font-cairo font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300">
            عرض جميع الموديلات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
