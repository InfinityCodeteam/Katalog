import { useState, useRef } from 'react'
import { Upload, X, Loader } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ImageUpload({ value, onChange, bucket = 'images', folder = '', className = '' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة يجب أن لا يتجاوز 5 ميجابايت')
      return
    }

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`

    const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true })
    if (error) {
      toast.error('فشل رفع الصورة')
      setUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
    onChange(publicUrl)
    setUploading(false)
    toast.success('تم رفع الصورة')
  }

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-gray-200 aspect-[4/3] bg-gray-50">
          <img src={value} alt="uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-gray-300 hover:border-gold-400 rounded-xl aspect-[4/3] flex flex-col items-center justify-center gap-3 bg-gray-50 hover:bg-gold-50 transition-all duration-300 cursor-pointer group"
        >
          {uploading ? (
            <Loader className="w-8 h-8 text-gold-500 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400 group-hover:text-gold-500 transition-colors" />
          )}
          <span className="font-cairo text-sm text-gray-500 group-hover:text-gold-600">
            {uploading ? 'جاري الرفع...' : 'اضغط لرفع صورة'}
          </span>
          <span className="font-cairo text-xs text-gray-400">PNG, JPG حتى 5MB</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && upload(e.target.files[0])}
      />
    </div>
  )
}

export function MultiImageUpload({ values = [], onChange, bucket = 'images', folder = '' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const upload = async (files) => {
    if (!files?.length) return
    setUploading(true)
    const newUrls = []

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      const ext = file.name.split('.').pop()
      const fileName = `${folder ? folder + '/' : ''}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true })
      if (!error) {
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
        newUrls.push(publicUrl)
      }
    }

    onChange([...values, ...newUrls])
    setUploading(false)
    if (newUrls.length) toast.success(`تم رفع ${newUrls.length} صورة`)
  }

  const remove = (url) => onChange(values.filter(v => v !== url))

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {values.map((url, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
            <img src={url} alt={`img-${i}`} className="w-full h-full object-cover" />
            <button type="button" onClick={() => remove(url)}
              className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
          className="aspect-square border-2 border-dashed border-gray-300 hover:border-gold-400 rounded-xl flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gold-50 transition-all cursor-pointer group">
          {uploading
            ? <Loader className="w-6 h-6 text-gold-500 animate-spin" />
            : <Upload className="w-6 h-6 text-gray-400 group-hover:text-gold-500 transition-colors" />
          }
          <span className="font-cairo text-xs text-gray-400 group-hover:text-gold-600">إضافة</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => upload(e.target.files)} />
    </div>
  )
}
