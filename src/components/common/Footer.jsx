import { Link } from 'react-router-dom'
import { Phone, MapPin, MessageCircle, Facebook, Instagram } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'

export default function Footer() {
  const { getSetting } = useSettings()

  const whatsappNumber = getSetting('whatsapp_number')
  const facebookUrl = getSetting('facebook_url')
  const instagramUrl = getSetting('instagram_url')

  return (
    <footer className="bg-navy-950 text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
                <span className="text-white font-cairo font-bold text-xl">ك</span>
              </div>
              <span className="font-cairo font-bold text-xl text-white">{getSetting('store_name')}</span>
            </div>
            <p className="text-navy-300 font-cairo text-sm leading-relaxed">
              {getSetting('hero_slogan')}
            </p>
            <div className="flex items-center gap-3 mt-5">
              {whatsappNumber && (
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-blue-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-pink-600 hover:bg-pink-500 rounded-full flex items-center justify-center transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-cairo font-bold text-gold-400 text-base mb-4">روابط سريعة</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/models', label: 'جميع الموديلات' },
                { to: '/selection', label: 'اختياراتي' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="text-navy-300 hover:text-gold-400 font-cairo text-sm transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-gold-500 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-cairo font-bold text-gold-400 text-base mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              {getSetting('phone_number') && (
                <li>
                  <a href={`tel:${getSetting('phone_number')}`}
                    className="flex items-center gap-3 text-navy-300 hover:text-gold-400 font-cairo text-sm transition-colors">
                    <Phone className="w-4 h-4 text-gold-500 flex-shrink-0" />
                    {getSetting('phone_number')}
                  </a>
                </li>
              )}
              {whatsappNumber && (
                <li>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-navy-300 hover:text-gold-400 font-cairo text-sm transition-colors">
                    <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    واتساب
                  </a>
                </li>
              )}
              {getSetting('address') && (
                <li>
                  <div className="flex items-start gap-3 text-navy-300 font-cairo text-sm">
                    <MapPin className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" />
                    {getSetting('address')}
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 py-6 text-center">
          <p className="text-navy-400 font-cairo text-sm">
            © {new Date().getFullYear()} {getSetting('store_name')}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
