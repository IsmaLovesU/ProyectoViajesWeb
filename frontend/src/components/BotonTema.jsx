import { useEffect } from 'react'
import { useTheme } from '../contexts.jsx'

function BotonTema() {
  const { tema, toggleTema } = useTheme()

  // Atajo T → toggle tema, con cleanup obligatorio
  // Se ignora si el foco está en un input para no interferir al escribir
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.key === 't' || e.key === 'T') toggleTema()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleTema])

  return (
    <button
      className="boton-tema"
      onClick={toggleTema}
      title={`Cambiar a tema ${tema === 'claro' ? 'oscuro' : 'claro'} (atajo: T)`}
    >
      {tema === 'claro' ? '🌙' : '☀️'} {tema === 'claro' ? 'Oscuro' : 'Claro'}
    </button>
  )
}

export default BotonTema