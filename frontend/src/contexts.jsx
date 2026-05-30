import { createContext, useContext, useState, useEffect } from 'react'
import { crearDestino } from './utils/destino'

const API_BASE = 'http://localhost:3000/api/items'

// 1. StorageContext — abstrae API vs LocalStorage
const StorageContext = createContext(null)

export function StorageProvider({ children }) {
  const [modo, setModoState] = useState(
    () => localStorage.getItem('storage_modo') || 'local'
  )

  function setModo(nuevoModo) {
    localStorage.setItem('storage_modo', nuevoModo)
    setModoState(nuevoModo)
  }

  async function obtenerItems() {
    if (modo === 'api') {
      const res = await fetch(API_BASE)
      if (!res.ok) throw new Error('Error al obtener items del servidor')
      return await res.json()
    } else {
      const guardado = localStorage.getItem('destinos')
      return guardado ? JSON.parse(guardado) : []
    }
  }

  async function guardarItem(item) {
    if (modo === 'api') {
      if (item.id) {
        const res = await fetch(`${API_BASE}/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
        if (!res.ok) throw new Error('Error al actualizar item')
        return item
      } else {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
        if (!res.ok) throw new Error('Error al crear item')
        const data = await res.json()
        return { ...item, id: data.id }
      }
    } else {
      const lista = JSON.parse(localStorage.getItem('destinos') || '[]')
      if (item.id) {
        const actualizada = lista.map(d =>
          d.id === item.id ? { ...item, fechaActividad: new Date().toISOString() } : d
        )
        localStorage.setItem('destinos', JSON.stringify(actualizada))
        return item
      } else {
        const nuevo = crearDestino(item)
        localStorage.setItem('destinos', JSON.stringify([nuevo, ...lista]))
        return nuevo
      }
    }
  }

  async function eliminarItem(id) {
    if (modo === 'api') {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al archivar item')
    } else {
      const lista = JSON.parse(localStorage.getItem('destinos') || '[]')
      const actualizada = lista.map(d =>
        d.id === id ? { ...d, activo: false, fechaActividad: new Date().toISOString() } : d
      )
      localStorage.setItem('destinos', JSON.stringify(actualizada))
    }
  }

  return (
    <StorageContext.Provider value={{ modo, setModo, obtenerItems, guardarItem, eliminarItem }}>
      {children}
    </StorageContext.Provider>
  )
}

export function useStorage() {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('useStorage debe usarse dentro de <StorageProvider>')
  return ctx
}



export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser debe usarse dentro de <UserProvider>')
  return ctx
}