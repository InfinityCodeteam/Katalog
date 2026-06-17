import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ModelCard from '../../components/common/ModelCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function Models() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [models, setModels] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const activeCategory = searchParams.get('category') || ''

  useEffect(() => {
    supabase.from('categories').select('*').order('name')
      .then(({ data }) => setCategories(data || []))
  }, [])

  useEffect(() => {
    fetchModels()
  }, [activeCategory])

  const fetchModels = async () => {
    setLoading(true)
    let query = supabase
      .from('models')
      .select('*, categories(name), model_images(image_url)')
      .order('created_at', { ascending: false })

    if (activeCategory) {
      query = query.eq('category_id', activeCategory)
    }

    const { data } = await query
    setModels(data || [])
    setLoading(false)
  }

  const filtered = models.filter(m =>
    !search.trim() || m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.description?.toLowerCase().includes(search.toLowerCase())
  )

  const setCategory = (id) => {
    if (id) setSearchParams({ category: id })
    else setSearchParams({})
  }

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="bg-navy-gradient py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-cairo font-black text-3xl md:text-4xl text-white mb-3">الموديلات</h1>
          <p className="font-cairo text-navy-300 text-base">تصفح مجموعتنا الكاملة من الستائر الفاخرة</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن موديل..."
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filter */}
            {categories.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <button
                  onClick={() => setCategory('')}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-cairo text-sm font-medium transition-all ${
                    !activeCategory
                      ? 'bg-gold-gradient text-white shadow-gold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  الكل
                </button>
                {categories.map(cat => (
                  <button key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl font-cairo text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-gold-gradient text-white shadow-gold'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-gray-500 font-cairo text-sm mb-5">
            {filtered.length} موديل
            {activeCategory && categories.find(c => c.id === activeCategory) &&
              ` في ${categories.find(c => c.id === activeCategory).name}`}
            {search && ` يطابق "${search}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-cairo text-gray-400 text-lg">لم يتم العثور على موديلات</p>
            <button onClick={() => { setSearch(''); setCategory('') }}
              className="mt-4 text-gold-600 hover:text-gold-700 font-cairo font-semibold text-sm underline">
              مسح الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
