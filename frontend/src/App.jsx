import { useState, useEffect } from 'react'
import FormularioDestino from './components/FormularioDestino'
import ListaDestinos from './components/ListaDestinos'
import ModalEdicion from './components/ModalEdicion'
import './App.css'

function App() {
  // lazy initializer para no leer localStorage en cada render
  const [destinos, setDestinos] = useState(() => {
    try {
      const guardado = localStorage.getItem('destinos')
      const lista = guardado ? JSON.parse(guardado) : []
      console.log('Destinos cargados del localStorage:', lista.length)
      return lista
    } catch (error) {
      console.log('Error al leer localStorage, iniciando vacío:', error)
      return []
    }
  })

  // (null = modal cerrado)
  const [destinoEnEdicion, setDestinoEnEdicion] = useState(null)

  // sincronizar con localStorage cada vez que cambia la lista
  useEffect(() => {
    localStorage.setItem('destinos', JSON.stringify(destinos))
    console.log('localStorage actualizado —', destinos.length, 'destinos')
  }, [destinos])

  // agregar destino nuevo al inicio de la lista
  function agregarDestino(nuevoDestino) {
    setDestinos(prev => [nuevoDestino, ...prev])
  }

  // guardar cambios del modal de edición
  function guardarEdicion(destinoEditado) {
    setDestinos(prev =>
      prev.map(d => d.id === destinoEditado.id
        ? { ...destinoEditado, fechaActividad: new Date().toISOString() }
        : d
      )
    )
    setDestinoEnEdicion(null)
  }

  // archivar = activo: false, no eliminar de verdad
  function archivarDestino(idDestino) {
    const confirmado = window.confirm('¿Archivar este destino? Seguirá guardado pero no aparecerá en la lista.')
    if (!confirmado) return

    setDestinos(prev =>
      prev.map(d => d.id === idDestino
        ? { ...d, activo: false, fechaActividad: new Date().toISOString() }
        : d
      )
    )
    console.log('Destino archivado:', idDestino)
  }

  // solo mostrar los activos
  const destinosActivos = destinos.filter(d => d.activo)

  const totalVisitados = destinosActivos.filter(d => d.estado === 'visitado').length
  const totalPendientes = destinosActivos.filter(d => d.estado === 'pendiente').length

  return (
    <div className="contenedor-app">
      <header className="cabecera">
        <div className="cabecera-texto">
          <h1>Mis Destinos ✈️</h1>
          <p className="subtitulo">Registro personal de viajes</p>
        </div>
        <div className="cabecera-stats">
          <span className="stat-chip stat-visitado">{totalVisitados} visitados</span>
          <span className="stat-chip stat-pendiente">{totalPendientes} pendientes</span>
        </div>
      </header>

      <main>
        <FormularioDestino alGuardar={agregarDestino} />
        <ListaDestinos
          destinos={destinosActivos}
          alEditar={setDestinoEnEdicion}
          alArchivar={archivarDestino}
        />
      </main>

      {/* modal de edición — solo se renderiza si hay algo en edición */}
      {destinoEnEdicion && (
        <ModalEdicion
          destino={destinoEnEdicion}
          alGuardar={guardarEdicion}
          alCerrar={() => setDestinoEnEdicion(null)}
        />
      )}
    </div>
  )
}

export default App