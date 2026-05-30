import TarjetaDestino from './TarjetaDestino'
import './ListaDestinos.css'

// recibe la lista ya filtrada desde App y la renderiza
function ListaDestinos({ destinos, alEditar, alArchivar, ultimoItemRef }) {
  if (destinos.length === 0) {
    return (
      <div className="lista-vacia">
        <span className="lista-vacia-icono">🗺️</span>
        <p>No hay destinos que mostrar</p>
        <p className="lista-vacia-sub">Agrega tu primer destino arriba</p>
      </div>
    )
  }

  return (
    <section className="seccion-lista">
      <h2 className="titulo-seccion">
        Mis destinos
        <span className="conteo-badge">{destinos.length}</span>
      </h2>

      <div className="grilla-destinos">
        {destinos.map((destino, index) => (
          <TarjetaDestino
            key={destino.id}
            destino={destino}
            alEditar={alEditar}
            alArchivar={alArchivar}
            ref={index === destinos.length - 1 ? ultimoItemRef : null}
          />
        ))}
      </div>
    </section>
  )
}

export default ListaDestinos