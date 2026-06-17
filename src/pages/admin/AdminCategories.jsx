import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '' })
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  const openAdd = () => { setEditing(null); setForm({ name: '' }); setShowForm(true) }
  const openEdit = (cat) => { setEditing(cat.id); setForm({ name: cat.name }); setShowForm(true) }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm({ name: '' }) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('يرجى إدخال اسم الفئة'); return }
    setSaving(true)
    if (editing) {
      const { error } = await supabase.from('categories').update({ name: form.name.trim() }).eq('id', editing)
      if (error) toast.error('فشل التحديث')
      else { toast.success('تم التحديث'); closeForm(); fetchCategories() }
    } else {
      const { error } = await supabase.from('categories').insert({ name: form.name.trim() })
      if (error) toast.error('فشل الإضافة')
      else { toast.success('تمت الإضافة'); closeForm(); fetchCategories() }
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

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-card p-6 border border-gold-200 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-cairo font-bold text-navy-900">{editing ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSave} className="flex gap-3">
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ name: e.target.value })}
              placeholder="اسم الفئة (مثل: ستائر عصرية)"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
              autoFocus
            />
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-gold-gradient text-white px-5 py-2.5 rounded-xl font-cairo font-bold text-sm shadow-gold disabled:opacity-60 transition-all">
              <Check className="w-4 h-4" />
              {saving ? 'جاري...' : 'حفظ'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 font-cairo">جاري التحميل...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-cairo text-gray-400 mb-4">لا توجد فئات بعد</p>
              <button onClick={openAdd} className="text-gold-600 hover:text-gold-700 font-cairo font-semibold text-sm underline">
                إضافة أول فئة
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-6 py-3 font-cairo font-bold text-navy-700 text-sm">#</th>
                  <th className="text-right px-6 py-3 font-cairo font-bold text-navy-700 text-sm">الاسم</th>
                  <th className="text-right px-6 py-3 font-cairo font-bold text-navy-700 text-sm">تاريخ الإضافة</th>
                  <th className="text-right px-6 py-3 font-cairo font-bold text-navy-700 text-sm">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((cat, i) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-cairo text-gray-400 text-sm">{i + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-cairo font-semibold text-navy-900 text-sm">{cat.name}</span>
                    </td>
                    <td className="px-6 py-4 font-cairo text-gray-400 text-sm">
                      {new Date(cat.created_at).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(cat)}
                          className="text-blue-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(cat.id)}
                          className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
