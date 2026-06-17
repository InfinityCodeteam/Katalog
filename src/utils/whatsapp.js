export function generateWhatsAppMessage(items) {
  if (!items.length) return ''

  let message = 'السلام عليكم\n\nلقد اخترت الموديلات التالية:\n\n'

  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`
    if (item.note?.trim()) {
      message += `   ملاحظات: ${item.note.trim()}\n`
    }
    message += '\n'
  })

  message += 'شكراً لكم'
  return message
}

export function openWhatsApp(phoneNumber, items) {
  const message = generateWhatsAppMessage(items)
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export function openWhatsAppWithMessage(phoneNumber, message) {
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
