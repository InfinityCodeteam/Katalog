import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const SettingsContext = createContext(null)

const DEFAULT_SETTINGS = {
  store_name: 'كتالوج الستائر',
  whatsapp_number: '201234567890',
  phone_number: '01234567890',
  address: 'القاهرة، مصر',
  facebook_url: '',
  instagram_url: '',
  hero_image_url: '',
  hero_slogan: 'أناقة لا مثيل لها في كل تفصيل',
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('key, value')
    if (data) {
      const map = {}
      data.forEach(({ key, value }) => { map[key] = value })
      setSettings(prev => ({ ...prev, ...map }))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const getSetting = (key) => settings[key] ?? DEFAULT_SETTINGS[key] ?? ''

  const refreshSettings = () => {
    setLoading(true)
    fetchSettings()
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, getSetting, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within SettingsProvider')
  return context
}
