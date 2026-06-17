import { useState } from 'react'
import { MapPin, Phone, User, MessageCircle, CheckCircle } from 'lucide-react'
import { useSettings } from '../../contexts/SettingsContext'
import { openWhatsAppWithMessage } from '../../utils/whatsapp'
import toast from 'react-hot-toast'

export default function RequestVisit() {
  const { getSetting } = useSettings()
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error('يرجى ملء جميع الحقول')
      return
    }

    const message =
      `السلام عليكم 🏠\n` +
      `أرغب في طلب معاينة منزلية\n\n` +
      `الاسم: ${form.name.trim()}\n` +
      `رقم الهاتف: ${form.phone.trim()}\n` +
      `العنوان: ${form.address.trim()}\n\n` +
      `شكراً لكم`

    openWhatsAppWithMessage(getSetting('whatsapp_number'), message)
    setSent(true)
  }

  const reset = () => { setForm({ name: '', phone: '', address: '' }); setSent(false) }

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="bg-navy-gradient py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-gradient shadow-gold-lg mx-auto mb-4">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-cairo font-black text-3xl md:text-4xl text-white mb-2">
            طلب معاينة منزلية
          </h1>
          <p className="font-cairo text-navy-300 text-base max-w-md mx-auto">
            أدخل بياناتك وسيتواصل معك فريقنا لتحديد موعد المعاينة
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-lg mx-auto">
          {sent ? (
            /* Success State */
            <div className="bg-white rounded-3xl shadow-card p-10 text-center animate-scale-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="font-cairo font-black text-2xl text-navy-900 mb-2">
                تم فتح واتساب!
              </h2>
              <p className="font-cairo text-gray-500 text-base leading-relaxed mb-8">
                تم تجهيز رسالة طلب المعاينة وفتح واتساب. أرسل الرسالة وسيتواصل معك فريقنا في أقرب وقت.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={reset}
                  className="flex-1 py-3 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-cairo font-bold text-gray-700 transition-all">
                  طلب معاينة أخرى
                </button>
                <a href="/"
                  className="flex-1 flex items-center justify-center py-3 bg-gold-gradient text-white rounded-xl font-cairo font-bold shadow-gold transition-all">
                  العودة للرئيسية
                </a>
              </div>
            </div>
          ) : (
            /* Form */
            <div className="bg-white rounded-3xl shadow-card overflow-hidden animate-fade-in">
              {/* Top accent */}
              <div className="h-1.5 bg-gold-gradient" />

              <form onSubmit={handleSend} className="p-8 space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 font-cairo font-semibold text-navy-800 text-sm mb-2">
                    <User className="w-4 h-4 text-gold-500" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="مثال: محمد أحمد"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all placeholder-gray-400"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 font-cairo font-semibold text-navy-800 text-sm mb-2">
                    <Phone className="w-4 h-4 text-gold-500" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="مثال: 01012345678"
                    required
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all placeholder-gray-400 text-right"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="flex items-center gap-2 font-cairo font-semibold text-navy-800 text-sm mb-2">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    العنوان التفصيلي
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="مثال: القاهرة - مدينة نصر - شارع عباس العقاد - بجوار..."
                    required
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all resize-none placeholder-gray-400 leading-relaxed"
                  />
                </div>

                {/* Preview */}
                {(form.name || form.phone || form.address) && (
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 animate-fade-in">
                    <p className="font-cairo font-semibold text-xs text-gray-400 mb-2 uppercase tracking-wide">
                      معاينة الرسالة
                    </p>
                    <div className="font-cairo text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {`السلام عليكم 🏠\nأرغب في طلب معاينة منزلية\n` +
                        (form.name ? `\nالاسم: ${form.name}` : '') +
                        (form.phone ? `\nرقم الهاتف: ${form.phone}` : '') +
                        (form.address ? `\nالعنوان: ${form.address}` : '') +
                        `\n\nشكراً لكم`}
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-cairo font-bold text-lg transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-6 h-6" />
                  إرسال عبر واتساب
                </button>

                <p className="font-cairo text-xs text-gray-400 text-center">
                  سيتم فتح واتساب تلقائياً بالرسالة جاهزة للإرسال
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
