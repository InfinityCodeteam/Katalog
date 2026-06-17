import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import ReviewCard from '../common/ReviewCard'
import ReviewForm from './ReviewForm'
import LoadingSpinner from '../common/LoadingSpinner'

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setReviews(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-cream">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-gold-500 font-cairo font-semibold text-sm mb-3 tracking-wider uppercase">
            آراء عملائنا
          </span>
          <h2 className="font-cairo font-black text-3xl md:text-4xl text-navy-900 mb-3">
            ماذا يقول عملاؤنا؟
          </h2>
          <div className="w-16 h-1 bg-gold-gradient mx-auto rounded-full" />
        </div>

        {loading ? (
          <LoadingSpinner size="lg" className="py-8" />
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews.map(review => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 font-cairo mb-16">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
        )}

        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-cairo font-bold text-xl text-navy-900">شاركنا رأيك</h3>
            <p className="text-gray-500 font-cairo text-sm mt-1">تقييمك يساعدنا على التحسين المستمر</p>
          </div>
          <ReviewForm />
        </div>
      </div>
    </section>
  )
}
