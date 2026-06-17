import { useEffect, useState } from 'react'
import { Check, X, Trash2, Star, Clock, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchReviews() }, [filter])

  const fetchReviews = async () => {
    setLoading(true)
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (filter === 'pending') query = query.eq('is_approved', false)
    if (filter === 'approved') query = query.eq('is_approved', true)
    const { data } = await query
    setReviews(data || [])
    setLoading(false)
  }

  const approve = async (id) => {
    const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
    if (error) toast.error('فشل الاعتماد')
    else { toast.success('تم اعتماد التقييم'); fetchReviews() }
  }

  const reject = async (id) => {
    const { error } = await supabase.from('reviews').update({ is_approved: false }).eq('id', id)
    if (error) toast.error('حدث خطأ')
    else { toast.success('تم رفض التقييم'); fetchReviews() }
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('reviews').delete().eq('id', deleteId)
    if (error) toast.error('فشل الحذف')
    else { toast.success('تم الحذف'); fetchReviews() }
    setDeleteId(null)
  }

  const FILTERS = [
    { key: 'pending', label: 'قيد الانتظار', icon: Clock },
    { key: 'approved', label: 'معتمدة', icon: CheckCircle },
    { key: 'all', label: 'الكل', icon: Star },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-cairo font-black text-2xl text-navy-900">التقييمات</h1>
        <p className="font-cairo text-gray-500 text-sm">مراجعة واعتماد تقييمات العملاء</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {FILTERS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-cairo font-medium text-sm transition-all ${
              filter === key
                ? 'bg-gold-gradient text-white shadow-gold'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-card'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-cairo">جاري التحميل...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-card">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-cairo text-gray-400">لا توجد تقييمات</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl shadow-card p-5 animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-white font-cairo font-bold text-sm flex-shrink-0">
                      {review.customer_name?.charAt(0) || '؟'}
                    </div>
                    <div>
                      <p className="font-cairo font-bold text-navy-900 text-sm">{review.customer_name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <span className={`mr-auto text-xs font-cairo px-2.5 py-1 rounded-full ${
                      review.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {review.is_approved ? 'معتمد' : 'قيد الانتظار'}
                    </span>
                  </div>
                  <p className="font-cairo text-gray-600 text-sm leading-relaxed mr-12">{review.comment}</p>
                  <p className="font-cairo text-gray-400 text-xs mr-12 mt-2">
                    {new Date(review.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>

                <div className="flex flex-col gap-2 flex-shrink-0">
                  {!review.is_approved && (
                    <button onClick={() => approve(review.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-cairo text-xs font-semibold transition-all">
                      <Check className="w-3.5 h-3.5" />
                      اعتماد
                    </button>
                  )}
                  {review.is_approved && (
                    <button onClick={() => reject(review.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg font-cairo text-xs font-semibold transition-all">
                      <X className="w-3.5 h-3.5" />
                      إلغاء الاعتماد
                    </button>
                  )}
                  <button onClick={() => setDeleteId(review.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg font-cairo text-xs font-semibold transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="حذف التقييم"
        message="هل أنت متأكد من حذف هذا التقييم نهائياً؟"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
