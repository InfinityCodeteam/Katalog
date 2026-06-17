import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ReviewForm() {
  const [form, setForm] = useState({ customer_name: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.customer_name.trim() || !form.comment.trim()) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from('reviews').insert({
      customer_name: form.customer_name.trim(),
      rating: form.rating,
      comment: form.comment.trim(),
      is_approved: false,
    })
    setSubmitting(false)
    if (error) {
      toast.error('حدث خطأ، يرجى المحاولة مرة أخرى')
    } else {
      setSubmitted(true)
      toast.success('شكراً لتقييمك! سيتم مراجعته قريباً')
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-card text-center animate-scale-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>
        <h3 className="font-cairo font-bold text-navy-900 text-xl mb-2">شكراً جزيلاً!</h3>
        <p className="text-gray-500 font-cairo text-sm">تم استلام تقييمك وسيتم نشره بعد المراجعة.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card space-y-5">
      <div>
        <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">اسمك</label>
        <input
          type="text"
          value={form.customer_name}
          onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
          placeholder="أدخل اسمك"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
          required
        />
      </div>

      <div>
        <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">التقييم</label>
        <div className="flex gap-2 flex-row-reverse justify-end">
          {[5, 4, 3, 2, 1].map(star => (
            <button key={star} type="button" onClick={() => setForm(f => ({ ...f, rating: star }))}>
              <Star className={`w-7 h-7 transition-colors ${star <= form.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">تعليقك</label>
        <textarea
          value={form.comment}
          onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
          placeholder="شاركنا تجربتك معنا..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all resize-none"
          required
        />
      </div>

      <button type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-white py-3 rounded-xl font-cairo font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300 disabled:opacity-60">
        {submitting ? (
          <span className="font-cairo">جاري الإرسال...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            إرسال التقييم
          </>
        )}
      </button>
    </form>
  )
}
