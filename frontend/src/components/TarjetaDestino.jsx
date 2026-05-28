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
    return (
        <article className="tarjeta-destino">

            {/* cabecera de la tarjeta */}
            <div className="tarjeta-cabecera">
                <div className="tarjeta-nombre-grupo">
                    <span
                        className="tarjeta-categoria-badge"
                        style={{ backgroundColor: categoria?.color + '22', color: categoria?.color }}
                    >
                        {categoria?.emoji} {categoria?.nombre}
                    </span>
                    <h3 className="tarjeta-nombre">{destino.nombre}</h3>
                </div>

                <span className={`tarjeta-estado tarjeta-estado--${destino.estado}`}>
                    {destino.estado === 'visitado' ? '✅ Visitado' : '⏳ Pendiente'}
                </span>
            </div>

            {/* detalles del viaje si los tiene */}
            {(destino.atributos?.pais || destino.atributos?.ciudad) && (
                <p className="tarjeta-ubicacion">
                    📍 {[destino.atributos.ciudad, destino.atributos.pais].filter(Boolean).join(', ')}
                </p>
            )}

            {/* puntuación solo si fue visitado y tiene nota */}
            {destino.estado === 'visitado' && destino.puntuacion !== null && (
                <div className="tarjeta-puntuacion">
                    <span className="puntuacion-numero">{destino.puntuacion}</span>
                    <span className="puntuacion-max">/10</span>
                </div>
            )}

            {/* atributos extra en chips pequeños */}
            <div className="tarjeta-chips">
                {destino.atributos?.transporte && (
                    <span className="chip">
                        {destino.atributos.transporte === 'avion' && '✈️'}
                        {destino.atributos.transporte === 'bus' && '🚌'}
                        {destino.atributos.transporte === 'auto' && '🚗'}
                        {destino.atributos.transporte === 'barco' && '🚢'}
                        {' '}{destino.atributos.transporte}
                    </span>
                )}
                {destino.atributos?.clima && (
                    <span className="chip">🌡️ {destino.atributos.clima}</span>
                )}
                {destino.atributos?.duracionDias && (
                    <span className="chip">📅 {destino.atributos.duracionDias} días</span>
                )}
                {destino.atributos?.presupuesto && (
                    <span className="chip">💵 ${destino.atributos.presupuesto}</span>
                )}
            </div>

            {/* notas si las tiene */}
            {destino.notas && (
                <p className="tarjeta-notas">{destino.notas}</p>
            )}

            <p className="tarjeta-fecha">Agregado el {formatearFecha(destino.fechaRegistro)}</p>

            {/* acciones */}
            <div className="tarjeta-acciones">
                <button
                    className="boton-accion boton-editar"
                    onClick={() => alEditar(destino)}
                >
                    Editar
                </button>
                <button
                    className="boton-accion boton-archivar"
                    onClick={() => alArchivar(destino.id)}
                >
                    Archivar
                </button>
            </div>

        </article>
    )
}
 
export default TarjetaDestino

