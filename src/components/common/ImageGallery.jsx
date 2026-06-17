import { useState } from 'react'
import { ChevronRight, ChevronLeft, X, ZoomIn } from 'lucide-react'

export default function ImageGallery({ images = [], modelName = '' }) {
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) {
    return (
      <div className="bg-gray-100 rounded-2xl aspect-[4/3] flex items-center justify-center">
        <span className="text-gray-400 font-cairo">لا توجد صورة</span>
      </div>
    )
  }

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <>
      <div className="space-y-3">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 group cursor-pointer"
          onClick={() => setLightbox(true)}>
          <img
            src={images[current]}
            alt={`${modelName} - صورة ${current + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
          </div>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-navy-900 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-navy-900 rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i) }}
                    className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-gold-500 w-5' : 'bg-white/70'}`} />
                ))}
              </div>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === current ? 'border-gold-500 shadow-gold' : 'border-transparent opacity-60 hover:opacity-100'
                }`}>
                <img src={img} alt={`thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}>
          <button onClick={() => setLightbox(false)}
            className="absolute top-4 left-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
            <X className="w-6 h-6" />
          </button>
          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}
          <img src={images[current]} alt={modelName}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  )
}
