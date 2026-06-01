import { useCallback } from 'react'
import { useTheme } from '../contexts.jsx'
import useAtajoTeclado from '../hooks/useAtajoTeclado.js'

function BotonTema() {
  const { tema, toggleTema } = useTheme()

  // useCallback para que useAtajoTeclado no re-registre el listener en cada render
  const manejarAtajoTema = useCallback(() => {
    toggleTema()
  }, [toggleTema])
 
  // Atajo T → toggle tema, ignorando inputs automáticamente
  useAtajoTeclado('t', manejarAtajoTema)
  useAtajoTeclado('T', manejarAtajoTema)

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