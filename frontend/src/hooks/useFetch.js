import { useState, useEffect } from 'react'

function useFetch(url, opciones = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!url) return

    const controlador = new AbortController()
    const { signal } = controlador

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        const respuesta = await fetch(url, { ...opciones, signal })

        if (!respuesta.ok) {
          throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`)
        }

        const json = await respuesta.json()
        setData(json)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message ?? 'Error desconocido')
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => controlador.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  return { data, loading, error }
}

export default useFetch
