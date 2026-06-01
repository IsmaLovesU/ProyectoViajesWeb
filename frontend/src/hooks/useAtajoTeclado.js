import { useEffect } from 'react'

function useAtajoTeclado(tecla, callback, opciones = {}) {
  const {
    ignorarEnInputs = true,
    ctrlKey = false,
    shiftKey = false
  } = opciones

  useEffect(() => {
    if (!tecla || typeof callback !== 'function') return

    function manejarTecla(evento) {
      if (ignorarEnInputs) {
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      }

      if (ctrlKey && !evento.ctrlKey) return
      if (shiftKey && !evento.shiftKey) return

      if (evento.key === tecla) {
        callback(evento)
      }
    }

    window.addEventListener('keydown', manejarTecla)
    return () => window.removeEventListener('keydown', manejarTecla)
  }, [tecla, callback, ignorarEnInputs, ctrlKey, shiftKey])
}

export default useAtajoTeclado