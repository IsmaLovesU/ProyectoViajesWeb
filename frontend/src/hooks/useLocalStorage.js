import { useState, useEffect } from 'react'

function useLocalStorage(clave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave)
      return guardado !== null ? JSON.parse(guardado) : valorInicial
    } catch {
      return valorInicial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
    } catch (error) {
      console.error(`useLocalStorage: no se pudo guardar la clave "${clave}"`, error)
    }
  }, [clave, valor])

  return [valor, setValor]
}

export default useLocalStorage