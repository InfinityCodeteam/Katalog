import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Package, FolderOpen, Star, Image, Settings, X, ExternalLink } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard, end: true },
  { to: '/admin/models', label: 'الموديلات', icon: Package },
  { to: '/admin/categories', label: 'الفئات', icon: FolderOpen },
  { to: '/admin/reviews', label: 'التقييمات', icon: Star },
  { to: '/admin/projects', label: 'الأعمال', icon: Image },
  { to: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 bottom-0 z-50 w-64 bg-navy-950 flex flex-col transition-transform duration-300
        lg:static lg:translate-x-0
        ${open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-navy-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-white font-cairo font-bold text-lg">ك</span>
            </div>
            <div>
              <p className="font-cairo font-bold text-white text-sm leading-tight">لوحة الإدارة</p>
              <p className="font-cairo text-navy-400 text-xs">كتالوج الستائر</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-navy-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl font-cairo font-medium text-sm transition-all duration-200
                ${isActive
                  ? 'bg-gold-gradient text-white shadow-gold'
                  : 'text-navy-300 hover:text-white hover:bg-navy-800'
                }
              `}
              onClick={onClose}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* View Site */}
        <div className="p-4 border-t border-navy-800">
          <Link to="/" target="_blank"
            className="flex items-center gap-2 text-navy-400 hover:text-gold-400 font-cairo text-sm transition-colors">
            <ExternalLink className="w-4 h-4" />
            عرض الموقع
          </Link>
        </div>
      </aside>
    </>
  )
}
