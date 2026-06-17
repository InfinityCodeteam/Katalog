import { Link } from 'react-router-dom'
import { Trash2, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import { useSelection } from '../../contexts/SelectionContext'
import { useSettings } from '../../contexts/SettingsContext'
import { openWhatsApp } from '../../utils/whatsapp'

export default function MySelection() {
  const { items, removeItem, updateNote, clearAll } = useSelection()
  const { getSetting } = useSettings()

  const handleSendWhatsApp = () => {
    const phone = getSetting('whatsapp_number')
    openWhatsApp(phone, items)
  }

  return (
    <main className="min-h-screen bg-cream pt-20">
      {/* Header */}
      <div className="bg-navy-gradient py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-cairo font-black text-3xl md:text-4xl text-white mb-2">اختياراتي</h1>
          <p className="font-cairo text-navy-300 text-base">الموديلات التي اخترتها للاستفسار عنها</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 max-w-4xl">
        {items.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gold-400" />
            </div>
            <h2 className="font-cairo font-bold text-2xl text-navy-900 mb-3">قائمتك فارغة</h2>
            <p className="font-cairo text-gray-500 mb-8">لم تقم بإضافة أي موديلات بعد. تصفح موديلاتنا وأضف ما يعجبك!</p>
            <Link to="/models"
              className="inline-flex items-center gap-2 bg-gold-gradient text-white px-8 py-3.5 rounded-xl font-cairo font-bold shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-105">
              <ArrowRight className="w-5 h-5 rotate-180" />
              تصفح الموديلات
            </Link>
          </div>
        ) : (
          <>
            {/* Items count & clear */}
            <div className="flex items-center justify-between mb-6">
              <p className="font-cairo font-semibold text-navy-900">
                {items.length} موديل مختار
              </p>
              <button onClick={clearAll}
                className="text-red-500 hover:text-red-600 font-cairo text-sm flex items-center gap-1.5 transition-colors">
                <Trash2 className="w-4 h-4" />
                مسح الكل
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-8">
              {items.map((item, index) => {
                const img = item.model_images?.[0]?.image_url || item.image_url
                return (
                  <div key={item.id}
                    className="bg-white rounded-2xl p-4 shadow-card flex flex-col sm:flex-row gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}>
                    {/* Image */}
                    <Link to={`/models/${item.id}`}
                      className="flex-shrink-0 w-full sm:w-24 h-40 sm:h-24 rounded-xl overflow-hidden bg-gray-100">
                      {img ? (
                        <img src={img} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl bg-gold-50">🪟</div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <Link to={`/models/${item.id}`}>
                            <h3 className="font-cairo font-bold text-navy-900 text-base hover:text-gold-600 transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          {item.categories?.name && (
                            <span className="text-xs font-cairo text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">
                              {item.categories.name}
                            </span>
                          )}
                        </div>
                        <button onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Note */}
                      <textarea
                        value={item.note || ''}
                        onChange={e => updateNote(item.id, e.target.value)}
                        placeholder="أضف ملاحظاتك هنا... (مثل: أريده للمعيشة - هل يتوفر بألوان أخرى؟)"
                        rows={2}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all resize-none text-gray-600 placeholder-gray-400"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-white rounded-2xl p-6 shadow-card border border-green-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-cairo font-bold text-navy-900 text-lg mb-1">
                    جاهز للإرسال؟
                  </h3>
                  <p className="font-cairo text-gray-500 text-sm">
                    سيتم إرسال قائمة اختياراتك مع ملاحظاتك عبر واتساب
                  </p>
                </div>
                <button
                  onClick={handleSendWhatsApp}
                  className="flex-shrink-0 flex items-center gap-3 bg-green-600 hover:bg-green-500 text-white px-7 py-3.5 rounded-xl font-cairo font-bold text-base transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  إرسال عبر واتساب
                </button>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link to="/models"
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-cairo font-semibold text-sm transition-colors">
                <ArrowRight className="w-4 h-4 rotate-180" />
                متابعة التصفح
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
