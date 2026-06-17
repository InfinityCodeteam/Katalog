import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { user, signIn } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/admin" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      toast.success('تم تسجيل الدخول بنجاح')
    } catch (err) {
      toast.error('بيانات الدخول غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4" dir="rtl">
      <div className="bg-hero-pattern absolute inset-0 opacity-20" />
      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 animate-scale-in">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold-lg">
              <span className="text-white font-cairo font-black text-3xl">ك</span>
            </div>
            <h1 className="font-cairo font-black text-2xl text-navy-900">لوحة الإدارة</h1>
            <p className="font-cairo text-gray-500 text-sm mt-1">تسجيل الدخول للمشرفين فقط</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@example.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all"
                required
                dir="ltr"
              />
            </div>

            <div>
              <label className="block font-cairo font-medium text-navy-800 text-sm mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 font-cairo text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all pr-4 pl-10"
                  required
                  dir="ltr"
                />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-white py-3.5 rounded-xl font-cairo font-bold text-base shadow-gold hover:shadow-gold-lg transition-all duration-300 disabled:opacity-60">
              {loading ? (
                <span>جاري التحقق...</span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  دخول
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
