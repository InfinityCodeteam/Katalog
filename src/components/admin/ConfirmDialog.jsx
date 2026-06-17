import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-gold-100'}`}>
          <AlertTriangle className={`w-6 h-6 ${danger ? 'text-red-500' : 'text-gold-500'}`} />
        </div>
        <h3 className="font-cairo font-bold text-navy-900 text-xl text-center mb-2">{title}</h3>
        <p className="font-cairo text-gray-500 text-sm text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 hover:border-gray-300 rounded-xl font-cairo font-medium text-gray-700 transition-all">
            إلغاء
          </button>
          <button onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl font-cairo font-bold text-white transition-all ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-gold-gradient hover:shadow-gold'
            }`}>
            تأكيد
          </button>
        </div>
      </div>
    </div>
  )
}
