import { Menu, LogOut, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function AdminHeader({ onMenuClick }) {
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('تم تسجيل الخروج')
    } catch {
      toast.error('حدث خطأ أثناء تسجيل الخروج')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden text-gray-500 hover:text-gray-700">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden lg:block">
          <p className="font-cairo font-semibold text-navy-900 text-sm">مرحباً بك في لوحة التحكم</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="font-cairo text-sm text-gray-700 hidden sm:block">{user?.email}</span>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-cairo text-sm font-medium transition-all">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    </header>
  )
}
