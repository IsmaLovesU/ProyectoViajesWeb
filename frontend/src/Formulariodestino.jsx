import { useState } from 'react'
import { CATEGORIAS_VIAJE } from '../utils/categorias'
import { crearDestino } from '../utils/destino'
import './FormularioDestino.css'

// valores vacíos del formulario — se reusan al limpiar después de guardar
const FORM_VACIO = {
  nombreLugar: '',
  categoriaId: 'ciudad',
  estado: 'pendiente',
  puntuacion: '',
  notas: '',
  pais: '',
  ciudad: '',
  transporte: '',
  clima: '',
  presupuesto: '',
  duracionDias: ''
}

function FormularioDestino({ alGuardar }) {
  const [campos, setCampos] = useState(FORM_VACIO)
  const [mostrarAtributos, setMostrarAtributos] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setCampos(prev => ({ ...prev, [name]: value }))
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    if (!campos.nombreLugar.trim()) {
      alert('El nombre del lugar es obligatorio')
      return
    }

    const nuevoDestino = crearDestino({
      nombreLugar: campos.nombreLugar.trim(),
      categoriaId: campos.categoriaId,
      estado: campos.estado,
      puntuacion: campos.puntuacion !== '' ? Number(campos.puntuacion) : null,
      notas: campos.notas.trim(),
      atributos: {
        pais: campos.pais,
        ciudad: campos.ciudad,
        transporte: campos.transporte,
        clima: campos.clima,
        presupuesto: campos.presupuesto !== '' ? Number(campos.presupuesto) : null,
        duracionDias: campos.duracionDias !== '' ? Number(campos.duracionDias) : null
      }
    })

    console.log('Nuevo destino creado:', nuevoDestino)
    alGuardar(nuevoDestino)
    setCampos(FORM_VACIO)
    setMostrarAtributos(false)
  }

  return (
    <form className="formulario-destino" onSubmit={manejarEnvio}>
  )
}

export default FormularioDestino