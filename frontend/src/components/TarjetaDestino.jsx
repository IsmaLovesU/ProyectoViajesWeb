import { obtenerCategoria } from '../utils/categorias'
import './TarjetaDestino.css'
 
// muestra la info de un destino y los botones de acción
function TarjetaDestino({ destino, alEditar, alArchivar }) {
  const categoria = obtenerCategoria(destino.categoriaId)
 
  // formatear fecha para mostrar algo legible
  function formatearFecha(isoString) {
    if (!isoString) return '—'
    const fecha = new Date(isoString)
    return fecha.toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
}
