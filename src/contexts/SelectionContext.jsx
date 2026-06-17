import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'katalog_selection'

const SelectionContext = createContext(null)

export function SelectionProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (model) => {
    setItems(prev => {
      if (prev.find(i => i.id === model.id)) return prev
      return [...prev, { ...model, note: '' }]
    })
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const updateNote = (id, note) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, note } : i))
  }

  const isSelected = (id) => items.some(i => i.id === id)

  const clearAll = () => setItems([])

  return (
    <SelectionContext.Provider value={{ items, addItem, removeItem, updateNote, isSelected, clearAll }}>
      {children}
    </SelectionContext.Provider>
  )
}

export function useSelection() {
  const context = useContext(SelectionContext)
  if (!context) throw new Error('useSelection must be used within SelectionProvider')
  return context
}
