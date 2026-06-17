import { Star } from 'lucide-react'

export default function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in">
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 font-cairo text-sm leading-relaxed mb-4 line-clamp-4">
        "{review.comment}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-white font-cairo font-bold text-sm">
          {review.customer_name?.charAt(0) || '؟'}
        </div>
        <div>
          <p className="font-cairo font-semibold text-navy-900 text-sm">{review.customer_name}</p>
          <p className="text-gray-400 text-xs font-cairo">عميل</p>
        </div>
      </div>
    </div>
  )
}
