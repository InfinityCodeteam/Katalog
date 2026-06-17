import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowRight, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ImageGallery from '../../components/common/ImageGallery'
import SelectionButton from '../../components/common/SelectionButton'
import { PageLoader } from '../../components/common/LoadingSpinner'

export default function ModelDetail() {
  const { id } = useParams()
  const [model, setModel] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchModel()
  }, [id])

  const fetchModel = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('models')
      .select('*, categories(id, name), model_images(image_url)')
      .eq('id', id)
      .single()

    setModel(data)
    if (data?.category_id) {
      const { data: rel } = await supabase
        .from('models')
        .select('*, categories(name), model_images(image_url)')
        .eq('category_id', data.category_id)
        .neq('id', id)
        .limit(4)
      setRelated(rel || [])
    }
    setLoading(false)
  }

  if (loading) return <PageLoader />
  if (!model) {
    return (
      <main className="min-h-screen bg-cream pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-cairo font-bold text-2xl text-navy-900 mb-2">الموديل غير موجود</h2>
          <Link to="/models" className="text-gold-600 hover:text-gold-700 font-cairo font-semibold underline">
            العودة للموديلات
          </Link>
        </div>
      </main>
    )
  }

  const images = model.model_images?.map(i => i.image_url).filter(Boolean) || []

  return (
    <main className="min-h-screen bg-cream pt-20">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-cairo text-gray-500 mb-6">
          <Link to="/" className="hover:text-gold-600 transition-colors">الرئيسية</Link>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <Link to="/models" className="hover:text-gold-600 transition-colors">الموديلات</Link>
          {model.categories && (
            <>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <Link to={`/models?category=${model.category_id}`}
                className="hover:text-gold-600 transition-colors">
                {model.categories.name}
              </Link>
            </>
          )}
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-navy-900 font-medium">{model.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="animate-fade-in">
            <ImageGallery images={images} modelName={model.name} />
          </div>

          {/* Details */}
          <div className="animate-slide-up">
            {model.categories && (
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gold-500" />
                <Link to={`/models?category=${model.category_id}`}
                  className="text-gold-600 hover:text-gold-700 font-cairo font-semibold text-sm transition-colors">
                  {model.categories.name}
                </Link>
              </div>
            )}

            <h1 className="font-cairo font-black text-3xl md:text-4xl text-navy-900 mb-5 leading-tight">
              {model.name}
            </h1>

            {model.description && (
              <div className="mb-8">
                <div className="w-10 h-0.5 bg-gold-gradient rounded-full mb-4" />
                <p className="font-cairo text-gray-600 text-base leading-relaxed">{model.description}</p>
              </div>
            )}

            {/* Highlight */}
            <div className="bg-gold-50 border border-gold-200 rounded-2xl p-5 mb-8">
              <p className="font-cairo font-semibold text-navy-800 text-sm mb-1">لطلب الاستفسار أو الطلب</p>
              <p className="font-cairo text-gray-600 text-xs leading-relaxed">
                أضف هذا الموديل لاختياراتك، ثم أرسل قائمتك عبر واتساب وسيتواصل معك فريقنا.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <SelectionButton model={model} size="lg" className="flex-1 justify-center" />
              <Link to="/selection"
                className="flex-1 flex items-center justify-center gap-2 border-2 border-navy-200 hover:border-navy-400 text-navy-700 hover:text-navy-900 px-6 py-3 rounded-xl font-cairo font-bold text-base transition-all duration-300">
                عرض اختياراتي
              </Link>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-cairo font-bold text-2xl text-navy-900 mb-6">موديلات مشابهة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(m => {
                const img = m.model_images?.[0]?.image_url
                return (
                  <Link key={m.id} to={`/models/${m.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {img ? (
                        <img src={img} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gold-50 flex items-center justify-center text-3xl">🪟</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-cairo font-bold text-navy-900 text-sm group-hover:text-gold-600 transition-colors line-clamp-1">{m.name}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
