import { Link } from 'react-router-dom'
import { MessageCircle, ChevronDown } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=1600&auto=format&fit=crop&q=80'

export default function Hero() {
  const { getSetting } = useSettings()
  const heroImage = getSetting('hero_image_url') || FALLBACK_IMAGE
  const whatsapp = getSetting('whatsapp_number')

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="ستائر فاخرة"
          className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/50 to-navy-950/80" />
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-20 pb-12">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold-500/20 backdrop-blur-sm border border-gold-500/30 text-gold-300 px-4 py-2 rounded-full text-sm font-cairo mb-6 animate-fade-in">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            كتالوج الستائر الفاخرة
          </div>

          {/* Title */}
          <h1 className="font-cairo font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 animate-slide-up">
            {getSetting('store_name')}
          </h1>

          {/* Slogan */}
          <p className="font-cairo text-xl md:text-2xl text-gold-300 font-medium mb-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {getSetting('hero_slogan')}
          </p>

          <p className="font-cairo text-navy-200 text-base md:text-lg leading-relaxed mb-8 max-w-lg animate-slide-up" style={{ animationDelay: '0.2s' }}>
            تصفح مجموعتنا الحصرية من الستائر الفاخرة، واختر ما يناسب ذوقك وديكور منزلك.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/models"
              className="inline-flex items-center gap-2 bg-gold-gradient text-white px-7 py-3.5 rounded-xl font-cairo font-bold text-base shadow-gold-lg hover:shadow-gold hover:scale-105 transition-all duration-300">
              تصفح الموديلات
            </Link>
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-7 py-3.5 rounded-xl font-cairo font-bold text-base transition-all duration-300 hover:scale-105">
                <MessageCircle className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="flex flex-col items-center gap-1 text-white/50">
          <span className="font-cairo text-xs">اكتشف المزيد</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cream to-transparent z-10" />
    </section>
  )
}
