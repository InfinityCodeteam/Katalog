import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import ImageUpload from '../../components/admin/ImageUpload'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import toast from 'react-hot-toast'

const EMPTY_FORM = { title: '', description: '', image_url: '' }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true) }
  const openEdit = (p) => { setEditing(p.id); setForm({ title: p.title, description: p.description || '', image_url: p.image_url || '' }); setShowModal(true) }
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY_FORM) }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('يرجى إدخال العنوان'); return }
    setSaving(true)
    const payload = { title: form.title.trim(), description: form.description.trim(), image_url: form.image_url }
    if (editing) {
      const { error } = await supabase.from('projects').update(payload).eq('id', editing)
      if (error) toast.error('فشل التحديث')
      else { toast.success('تم التحديث'); closeModal(); fetchProjects() }
    } else {
      const { error } = await supabase.from('projects').insert(payload)
      if (error) toast.error('فشل الإضافة')
      else { toast.success('تمت الإضافة'); closeModal(); fetchProjects() }
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    const { error } = await supabase.from('projects').delete().eq('id', deleteId)
    if (error) toast.error('فشل الحذف')
    else { toast.success('تم الحذف'); fetchProjects() }
    setDeleteId(null)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-cairo font-black text-2xl text-navy-900">الأعمال</h1>
          <p className="font-cairo text-gray-500 text-sm">{projects.length} مشروع</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gold-gradient text-white px-5 py-2.5 rounded-xl font-cairo font-bold text-sm shadow-gold hover:shadow-gold-lg transition-all">
          <Plus className="w-4 h-4" />
          إضافة مشروع
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 font-cairo">جاري التحميل...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-2xl shadow-card overflow-hidden group">
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                {project.image_url
                  ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                }
              </div>
              <div className="p-4">
                <h3 className="font-cairo font-bold text-navy-900 mb-1">{project.title}</h3>
                {project.description && (
                  <p className="font-cairo text-gray-500 text-sm line-clamp-2">{project.description}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl font-cairo text-sm font-medium transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                    تعديل
                  </button>
                  <button onClick={() => setDeleteId(project.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-cairo text-sm font-medium transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-cairo font-bold text-navy-900 text-lg">
                {editing ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">العنوان *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="عنوان المشروع"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all" />
              </div>
              <div>
                <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">الوصف</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="وصف المشروع"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all resize-none" />
              </div>
              <div>
                <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">الصورة</label>
                <ImageUpload value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))}
                  bucket="projects" folder="projects" />
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
        title="حذف المشروع"
        message="هل أنت متأكد من حذف هذا المشروع؟"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}
