import { useStorage } from '../contexts.jsx'

function ControlModo() {
  const { modo, setModo } = useStorage()

  return (
    <div className="control-modo">
      <span
        className={`modo-label ${modo === 'local' ? 'modo-activo' : ''}`}
        onClick={() => setModo('local')}
      >
        <span className="modo-dot"></span>
        Local
      </span>

      <button
        className={`modo-toggle ${modo === 'api' ? 'modo-toggle--api' : 'modo-toggle--local'}`}
        onClick={() => setModo(modo === 'api' ? 'local' : 'api')}
        title={`Modo actual: ${modo.toUpperCase()}. Click para cambiar.`}
      >
        <span className="modo-toggle-thumb"></span>
      </button>

      <span
        className={`modo-label ${modo === 'api' ? 'modo-activo' : ''}`}
        onClick={() => setModo('api')}
      >
        API
        <span className="modo-dot"></span>
      </span>
    </div>
  )
}

export default ControlModo