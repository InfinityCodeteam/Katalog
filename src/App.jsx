import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { SelectionProvider } from './contexts/SelectionContext'
import { SettingsProvider } from './contexts/SettingsContext'

// Layout
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

// Public Pages
import Home from './pages/public/Home'
import Models from './pages/public/Models'
import ModelDetail from './pages/public/ModelDetail'
import MySelection from './pages/public/MySelection'
import RequestVisit from './pages/public/RequestVisit'

// Admin Pages
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminModels from './pages/admin/AdminModels'
import AdminCategories from './pages/admin/AdminCategories'
import AdminReviews from './pages/admin/AdminReviews'
import AdminProjects from './pages/admin/AdminProjects'
import AdminSettings from './pages/admin/AdminSettings'

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <p className="font-cairo font-black text-8xl text-gold-300 mb-4">404</p>
        <h1 className="font-cairo font-bold text-2xl text-navy-900 mb-2">الصفحة غير موجودة</h1>
        <a href="/" className="text-gold-600 hover:text-gold-700 font-cairo font-semibold underline">
          العودة للرئيسية
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <SelectionProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: 'Cairo, sans-serif',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  direction: 'rtl',
                },
                success: {
                  iconTheme: { primary: '#C9A96E', secondary: '#fff' },
                },
              }}
            />
            <Routes>
              {/* Public */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/models" element={<Models />} />
                <Route path="/models/:id" element={<ModelDetail />} />
                <Route path="/selection" element={<MySelection />} />
                <Route path="/request-visit" element={<RequestVisit />} />
              </Route>

              {/* Admin */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="models" element={<AdminModels />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </SelectionProvider>
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
