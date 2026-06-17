import { useEffect, useState } from 'react'
import { Save, Store, Phone, MapPin, Facebook, Instagram, MessageCircle, Image } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ImageUpload from '../../components/admin/ImageUpload'
import { useSettings } from '../../contexts/SettingsContext'
import toast from 'react-hot-toast'

const FIELDS = [
  { key: 'store_name', label: 'اسم المتجر', icon: Store, placeholder: 'كتالوج الستائر', type: 'text' },
  { key: 'hero_slogan', label: 'الشعار التسويقي', icon: Store, placeholder: 'أناقة لا مثيل لها في كل تفصيل', type: 'text' },
  { key: 'whatsapp_number', label: 'رقم واتساب', icon: MessageCircle, placeholder: '201234567890', type: 'text', hint: 'بدون + أو مسافات' },
  { key: 'phone_number', label: 'رقم الهاتف', icon: Phone, placeholder: '01234567890', type: 'text' },
  { key: 'address', label: 'العنوان', icon: MapPin, placeholder: 'القاهرة، مصر', type: 'text' },
  { key: 'facebook_url', label: 'رابط فيسبوك', icon: Facebook, placeholder: 'https://facebook.com/...', type: 'url' },
  { key: 'instagram_url', label: 'رابط إنستقرام', icon: Instagram, placeholder: 'https://instagram.com/...', type: 'url' },
]

export default function AdminSettings() {
  const { settings, refreshSettings } = useSettings()
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [heroImage, setHeroImage] = useState('')

  useEffect(() => {
    const initial = {}
    FIELDS.forEach(f => { initial[f.key] = settings[f.key] || '' })
    setForm(initial)
    setHeroImage(settings.hero_image_url || '')
  }, [settings])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const entries = [
      ...FIELDS.map(f => ({ key: f.key, value: form[f.key] || '' })),
      { key: 'hero_image_url', value: heroImage },
    ]

    const { error } = await supabase.from('settings').upsert(
      entries.map(({ key, value }) => ({ key, value })),
      { onConflict: 'key' }
    )

    if (error) {
      toast.error('فشل الحفظ')
    } else {
      toast.success('تم حفظ الإعدادات')
      refreshSettings()
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="font-cairo font-black text-2xl text-navy-900">الإعدادات</h1>
        <p className="font-cairo text-gray-500 text-sm">إعدادات المتجر والتواصل الاجتماعي</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <h2 className="font-cairo font-bold text-navy-900 text-base border-b border-gray-100 pb-3">
            معلومات المتجر
          </h2>
          {FIELDS.map(({ key, label, icon: Icon, placeholder, type, hint }) => (
            <div key={key}>
              <label className="flex items-center gap-2 font-cairo font-medium text-navy-800 text-sm mb-2">
                <Icon className="w-4 h-4 text-gold-500" />
                {label}
              </label>
              <input
                type={type}
                value={form[key] || ''}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
                dir={type === 'url' ? 'ltr' : undefined}
              />
              {hint && <p className="font-cairo text-xs text-gray-400 mt-1">{hint}</p>}
            </div>
          ))}
        </div>

        {/* Hero Image */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-cairo font-bold text-navy-900 text-base border-b border-gray-100 pb-3 mb-5 flex items-center gap-2">
            <Image className="w-4 h-4 text-gold-500" />
            صورة الغلاف الرئيسية
          </h2>
          <ImageUpload
            value={heroImage}
            onChange={setHeroImage}
            bucket="settings"
            folder="hero"
          />
          <p className="font-cairo text-xs text-gray-400 mt-2">تُستخدم في خلفية القسم الرئيسي في الصفحة الرئيسية</p>
        </div>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-white py-3.5 rounded-xl font-cairo font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300 disabled:opacity-60">
          <Save className="w-5 h-5" />
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
        </button>
      </form>
    </div>
  )
}
