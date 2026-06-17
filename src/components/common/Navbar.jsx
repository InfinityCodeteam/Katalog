import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, Phone } from 'lucide-react'
import { useSelection } from '../../contexts/SelectionContext'
import { useSettings } from '../../contexts/SettingsContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { items } = useSelection()
  const { getSetting } = useSettings()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  const isHome = location.pathname === '/'

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/models', label: 'الموديلات' },
    { to: '/selection', label: 'اختياراتي' },
  ]

  return (
    <header className={`fixed top-0 right-0 left-0 z-40 transition-all duration-300 ${
      scrolled || !isHome
        ? 'bg-white/95 backdrop-blur-md shadow-md'
        : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-white font-cairo font-bold text-lg">ك</span>
            </div>
            <span className={`font-cairo font-bold text-lg transition-colors ${
              scrolled || !isHome ? 'text-navy-900' : 'text-white'
            }`}>
              {getSetting('store_name')}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `
                  relative px-4 py-2 font-cairo font-medium text-sm rounded-lg transition-all duration-200
                  ${isActive
                    ? 'text-gold-600 bg-gold-50'
                    : scrolled || !isHome
                      ? 'text-navy-700 hover:text-gold-600 hover:bg-gold-50'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }
                `}>
                {label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${getSetting('phone_number')}`}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-cairo font-semibold text-sm transition-all duration-300 ${
                scrolled || !isHome
                  ? 'text-navy-700 hover:text-gold-600 border border-gray-200 hover:border-gold-300'
                  : 'text-white/90 hover:text-white border border-white/30 hover:border-white/60'
              }`}
            >
              <Phone className="w-4 h-4" />
              اتصل بنا
            </a>

            <Link to="/selection"
              className="relative flex items-center gap-2 bg-gold-gradient text-white px-4 py-2 rounded-xl font-cairo font-semibold text-sm shadow-gold hover:shadow-gold-lg transition-all duration-300 hover:scale-105">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">اختياراتي</span>
              {items.length > 0 && (
                <span className="absolute -top-2 -left-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {items.length}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setOpen(o => !o)}
              className={`md:hidden p-2 rounded-lg transition-colors ${
                scrolled || !isHome ? 'text-navy-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-slide-up">
            <div className="py-3 space-y-1 px-2">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `
                    block px-4 py-3 font-cairo font-medium text-base rounded-xl transition-colors
                    ${isActive ? 'text-gold-600 bg-gold-50' : 'text-navy-700 hover:text-gold-600 hover:bg-gold-50'}
                  `}>
                  {label}
                </NavLink>
              ))}
              <a href={`tel:${getSetting('phone_number')}`}
                className="flex items-center gap-2 px-4 py-3 font-cairo font-medium text-base rounded-xl text-navy-700 hover:text-gold-600 hover:bg-gold-50 transition-colors">
                <Phone className="w-4 h-4" />
                اتصل بنا
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
