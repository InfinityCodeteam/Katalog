import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ImageUpload from '../../components/admin/ImageUpload'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', image_url: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (cat) => {
    setEditing(cat.id)
    setForm({ name: cat.name, image_url: cat.image_url || '' })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('يرجى إدخال اسم الفئة'); return }
    setSaving(true)
    const payload = { name: form.name.trim(), image_url: form.image_url || null }
    if (editing) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing)
      if (error) toast.error('فشل التحديث')
      else { toast.success('تم التحديث'); closeModal(); fetchCategories() }
    } else {
      const { error } = await supabase.from('categories').insert(payload)
      if (error) toast.error('فشل الإضافة')
      else { toast.success('تمت الإضافة'); closeModal(); fetchCategories() }
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('categories').delete().eq('id', deleteId)
    if (error) toast.error('فشل الحذف - تأكد من عدم وجود موديلات في هذه الفئة')
    else { toast.success('تم الحذف'); fetchCategories() }
    setDeleteId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cairo font-black text-2xl text-navy-900">الفئات</h1>
          <p className="font-cairo text-gray-500 text-sm">{categories.length} فئة</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gold-gradient text-white px-5 py-2.5 rounded-xl font-cairo font-bold text-sm shadow-gold hover:shadow-gold-lg transition-all">
          <Plus className="w-4 h-4" />
          إضافة فئة
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-cairo">جاري التحميل...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-card text-center py-16">
          <p className="font-cairo text-gray-400 mb-4">لا توجد فئات بعد</p>
          <button onClick={openAdd} className="text-gold-600 font-cairo font-semibold text-sm underline">
            إضافة أول فئة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
              {/* Image preview */}
              <div className="relative aspect-[3/2] bg-gray-100 overflow-hidden">
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold-50 to-navy-50">
                    <span className="text-4xl opacity-40">🪟</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                <p className="absolute bottom-3 right-3 font-cairo font-bold text-white text-base drop-shadow">
                  {cat.name}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 p-3">
                <button onClick={() => openEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl font-cairo text-sm font-medium transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                  تعديل
                </button>
                <button onClick={() => setDeleteId(cat.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-cairo text-sm font-medium transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-cairo font-bold text-navy-900 text-lg">
                {editing ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">اسم الفئة *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="مثل: ستائر عصرية"
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
                />
              </div>
              <div>
                <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">صورة الفئة</label>
                <ImageUpload
                  value={form.image_url}
                  onChange={url => setForm(f => ({ ...f, image_url: url }))}
                  bucket="categories"
                  folder="categories"
                />
                <p className="font-cairo text-xs text-gray-400 mt-2">تظهر كخلفية لبطاقة الفئة في الصفحة الرئيسية</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-cairo font-medium text-gray-700 hover:bg-gray-50 transition-all">
                  إلغاء
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-gold-gradient text-white rounded-xl font-cairo font-bold shadow-gold hover:shadow-gold-lg transition-all disabled:opacity-60">
                  {saving ? 'جاري الحفظ...' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="حذف الفئة"
        message="هل أنت متأكد من حذف هذه الفئة؟ لا يمكن حذفها إذا كانت تحتوي على موديلات."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
