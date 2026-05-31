import { useState, useEffect, useRef, useCallback } from 'react'
import FormularioDestino from './components/FormularioDestino'
import ListaDestinos from './components/ListaDestinos'
import ModalEdicion from './components/ModalEdicion'
import BotonTema from './components/BotonTema'
import ControlModo from './components/ControlModo'
import { useStorage, useTheme } from './contexts.jsx'
import './App.css'

function App() {
  const { obtenerItems, guardarItem, eliminarItem } = useStorage()
  const { tema } = useTheme()
 
  const [destinos, setDestinos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [destinoEnEdicion, setDestinoEnEdicion] = useState(null)
 
  // useRef #1 — focus al input de nombre después de guardar y con Ctrl+N
  const inputNombreRef = useRef(null)
 
  // useRef #2 — scroll automático al último destino agregado
  const ultimoItemRef = useRef(null)
 
  // Cargar items al montar y cuando cambia el modo
  useEffect(() => {
    async function cargar() {
      setCargando(true)
      try {
        const items = await obtenerItems()
        setDestinos(items)
      } catch (err) {
        console.error('Error al cargar destinos:', err)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [obtenerItems])
 
  async function agregarDestino(datosNuevo) {
    try {
      const guardado = await guardarItem(datosNuevo)
      setDestinos(prev => [guardado, ...prev])
 
      // useRef #2: scroll suave al item recién agregado
      setTimeout(() => {
        ultimoItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
 
      // useRef #1: foco de vuelta al input para seguir agregando
      setTimeout(() => {
        inputNombreRef.current?.focus()
      }, 150)
    } catch (err) {
      console.error('Error al guardar destino:', err)
    }
  }
 
  async function guardarEdicion(destinoEditado) {
    try {
      await guardarItem(destinoEditado)
      setDestinos(prev =>
        prev.map(d => d.id === destinoEditado.id
          ? { ...destinoEditado, fechaActividad: new Date().toISOString() }
          : d
        )
      )
      setDestinoEnEdicion(null)
    } catch (err) {
      console.error('Error al editar destino:', err)
    }
  }
 
  async function archivarDestino(idDestino) {
    const confirmado = window.confirm('¿Archivar este destino?')
    if (!confirmado) return
    try {
      await eliminarItem(idDestino)
      setDestinos(prev => prev.filter(d => d.id !== idDestino))
    } catch (err) {
      console.error('Error al archivar destino:', err)
    }
  }
 
  // Atajos de teclado con cleanup — patrón obligatorio del doc
  const manejarAtajos = useCallback((e) => {
    // Ctrl+N → focus al input de nombre (useRef #1)
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault()
      inputNombreRef.current?.focus()
      inputNombreRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    // T → toggle tema (el resto de la lógica está en BotonTema.jsx)
  }, [])
 
  useEffect(() => {
    window.addEventListener('keydown', manejarAtajos)
    return () => window.removeEventListener('keydown', manejarAtajos)
  }, [manejarAtajos])
 
  const destinosActivos = destinos.filter(d => d.activo !== false)
  const totalVisitados  = destinosActivos.filter(d => d.estado === 'visitado').length
  const totalPendientes = destinosActivos.filter(d => d.estado === 'pendiente').length
 
  return (
    <div className="contenedor-app">
      <header className="cabecera">
        <div className="cabecera-texto">
          <h1>Mis Destinos ✈️</h1>
          <p className="subtitulo">Registro personal de viajes</p>
        </div>
 
        <div className="cabecera-controles">
          <BotonTema />
          <ControlModo />
          <div className="cabecera-stats">
            <span className="stat-chip stat-visitado">{totalVisitados} visitados</span>
            <span className="stat-chip stat-pendiente">{totalPendientes} pendientes</span>
          </div>
        </div>
      </header>
 
      <main>
        {cargando ? (
          <p className="cargando">Cargando destinos…</p>
        ) : (
          <>
            <FormularioDestino alGuardar={agregarDestino} inputNombreRef={inputNombreRef} />
            <ListaDestinos
              destinos={destinosActivos}
              alEditar={setDestinoEnEdicion}
              alArchivar={archivarDestino}
              ultimoItemRef={ultimoItemRef}
            />
          </>
        )}
      </main>
 
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