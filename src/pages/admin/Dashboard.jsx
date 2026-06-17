import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, FolderOpen, Star, Image, TrendingUp, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase'

function StatCard({ label, value, icon: Icon, color, to }) {
  return (
    <Link to={to}
      className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <TrendingUp className="w-4 h-4 text-gray-300 group-hover:text-gold-400 transition-colors" />
      </div>
      <p className="font-cairo font-black text-3xl text-navy-900 mb-1">{value ?? '—'}</p>
      <p className="font-cairo text-gray-500 text-sm">{label}</p>
    </Link>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({})
  const [recentModels, setRecentModels] = useState([])
  const [pendingReviews, setPendingReviews] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      const [models, categories, reviews, projects, pending] = await Promise.all([
        supabase.from('models').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', true),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('is_approved', false),
      ])
      setStats({
        models: models.count,
        categories: categories.count,
        reviews: reviews.count,
        projects: projects.count,
      })
      setPendingReviews(pending.count || 0)
    }

    const fetchRecent = async () => {
      const { data } = await supabase
        .from('models')
        .select('id, name, created_at, categories(name), model_images(image_url)')
        .order('created_at', { ascending: false })
        .limit(5)
      setRecentModels(data || [])
    }

    fetchStats()
    fetchRecent()
  }, [])

  const STAT_CARDS = [
    { label: 'الموديلات', value: stats.models, icon: Package, color: 'bg-gold-gradient', to: '/admin/models' },
    { label: 'الفئات', value: stats.categories, icon: FolderOpen, color: 'bg-navy-gradient', to: '/admin/categories' },
    { label: 'التقييمات المعتمدة', value: stats.reviews, icon: Star, color: 'bg-gradient-to-br from-amber-400 to-amber-600', to: '/admin/reviews' },
    { label: 'مشاريع الأعمال', value: stats.projects, icon: Image, color: 'bg-gradient-to-br from-teal-400 to-teal-600', to: '/admin/projects' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-cairo font-black text-2xl text-navy-900 mb-1">لوحة التحكم</h1>
        <p className="font-cairo text-gray-500 text-sm">نظرة عامة على محتوى الموقع</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Pending reviews alert */}
      {pendingReviews > 0 && (
        <Link to="/admin/reviews"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:bg-amber-100 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-cairo font-bold text-amber-800 text-sm">
              {pendingReviews} تقييم في انتظار المراجعة
            </p>
            <p className="font-cairo text-amber-600 text-xs">اضغط للمراجعة والاعتماد</p>
          </div>
        </Link>
      )}

      {/* Recent Models */}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-cairo font-bold text-navy-900 text-lg">آخر الموديلات المضافة</h2>
          <Link to="/admin/models" className="text-gold-600 hover:text-gold-700 font-cairo text-sm font-semibold transition-colors">
            عرض الكل
          </Link>
        </div>
        <div className="space-y-3">
          {recentModels.map(model => {
            const img = model.model_images?.[0]?.image_url
            return (
              <div key={model.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {img
                    ? <img src={img} alt={model.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-lg">🪟</div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cairo font-semibold text-navy-900 text-sm truncate">{model.name}</p>
                  {model.categories && (
                    <p className="font-cairo text-xs text-gray-500">{model.categories.name}</p>
                  )}
                </div>
                <p className="font-cairo text-xs text-gray-400 flex-shrink-0">
                  {new Date(model.created_at).toLocaleDateString('ar-EG')}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
