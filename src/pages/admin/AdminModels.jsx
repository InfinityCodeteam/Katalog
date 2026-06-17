import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { MultiImageUpload } from '../../components/admin/ImageUpload'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import toast from 'react-hot-toast'

const EMPTY_FORM = { name: '', description: '', category_id: '' }

export default function AdminModels() {
  const [models, setModels] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([])
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchModels()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
  }

  const fetchModels = async () => {
    const { data } = await supabase
      .from('models')
      .select('*, categories(name), model_images(id, image_url)')
      .order('created_at', { ascending: false })
    setModels(data || [])
    setLoading(false)
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImages([])
    setShowModal(true)
  }

  const openEdit = (model) => {
    setEditing(model.id)
    setForm({ name: model.name, description: model.description || '', category_id: model.category_id || '' })
    setImages(model.model_images?.map(i => i.image_url) || [])
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setImages([])
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('يرجى إدخال اسم الموديل'); return }
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category_id: form.category_id || null,
    }

    let modelId = editing

    if (editing) {
      const { error } = await supabase.from('models').update(payload).eq('id', editing)
      if (error) { toast.error('فشل التحديث'); setSaving(false); return }
      // Update images: delete old, insert new
      await supabase.from('model_images').delete().eq('model_id', editing)
    } else {
      const { data, error } = await supabase.from('models').insert(payload).select().single()
      if (error) { toast.error('فشل الإضافة'); setSaving(false); return }
      modelId = data.id
    }

    // Insert images
    if (images.length > 0) {
      await supabase.from('model_images').insert(
        images.map(url => ({ model_id: modelId, image_url: url }))
      )
    }

    toast.success(editing ? 'تم التحديث' : 'تمت الإضافة')
    closeModal()
    fetchModels()
    setSaving(false)
  }

  const handleDelete = async () => {
    await supabase.from('model_images').delete().eq('model_id', deleteId)
    const { error } = await supabase.from('models').delete().eq('id', deleteId)
    if (error) toast.error('فشل الحذف')
    else { toast.success('تم الحذف'); fetchModels() }
    setDeleteId(null)
  }

  const filtered = models.filter(m =>
    !search.trim() || m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cairo font-black text-2xl text-navy-900">الموديلات</h1>
          <p className="font-cairo text-gray-500 text-sm">{models.length} موديل</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gold-gradient text-white px-5 py-2.5 rounded-xl font-cairo font-bold text-sm shadow-gold hover:shadow-gold-lg transition-all">
          <Plus className="w-4 h-4" />
          إضافة موديل
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث في الموديلات..."
          className="w-full bg-white border border-gray-200 rounded-xl pr-10 pl-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all shadow-card" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-cairo">جاري التحميل...</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-cairo text-gray-400 mb-4">لا توجد موديلات</p>
              <button onClick={openAdd} className="text-gold-600 font-cairo font-semibold text-sm underline">إضافة أول موديل</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-right px-5 py-3 font-cairo font-bold text-navy-700 text-sm">الموديل</th>
                    <th className="text-right px-5 py-3 font-cairo font-bold text-navy-700 text-sm">الفئة</th>
                    <th className="text-right px-5 py-3 font-cairo font-bold text-navy-700 text-sm">الصور</th>
                    <th className="text-right px-5 py-3 font-cairo font-bold text-navy-700 text-sm">التاريخ</th>
                    <th className="text-right px-5 py-3 font-cairo font-bold text-navy-700 text-sm">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(model => {
                    const img = model.model_images?.[0]?.image_url
                    return (
                      <tr key={model.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {img
                                ? <img src={img} alt={model.name} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-base">🪟</div>
                              }
                            </div>
                            <div>
                              <p className="font-cairo font-semibold text-navy-900 text-sm">{model.name}</p>
                              {model.description && (
                                <p className="font-cairo text-xs text-gray-400 line-clamp-1 max-w-xs">{model.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {model.categories ? (
                            <span className="bg-gold-50 text-gold-700 text-xs font-cairo px-2.5 py-1 rounded-full">{model.categories.name}</span>
                          ) : (
                            <span className="text-gray-400 text-xs font-cairo">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-cairo text-sm text-gray-600">{model.model_images?.length || 0} صورة</span>
                        </td>
                        <td className="px-5 py-3.5 font-cairo text-xs text-gray-400">
                          {new Date(model.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(model)}
                              className="text-blue-500 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-all">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteId(model.id)}
                              className="text-red-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-cairo font-bold text-navy-900 text-lg">
                {editing ? 'تعديل الموديل' : 'إضافة موديل جديد'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">اسم الموديل *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="مثل: رويال جولد"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all" />
                </div>
                <div>
                  <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">الفئة</label>
                  <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all bg-white">
                    <option value="">بدون فئة</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">الوصف</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="وصف الموديل..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all resize-none" />
              </div>
              <div>
                <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">
                  الصور ({images.length} صورة)
                </label>
                <MultiImageUpload values={images} onChange={setImages} bucket="models" folder="models" />
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
        title="حذف الموديل"
        message="هل أنت متأكد من حذف هذا الموديل وجميع صوره؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
