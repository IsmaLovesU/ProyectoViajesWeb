export function crearDestino({
  nombreLugar,
  categoriaId,
  estado = 'pendiente',
  puntuacion = null,
  notas = '',
  atributos = {}
}) {
  const ahora = new Date().toISOString()

  return {
    id: crypto.randomUUID(),
    nombre: nombreLugar,
    categoriaId,
    estado,         
    puntuacion,       
    fechaRegistro: ahora,
    fechaActividad: ahora,
    notas,
    // específicos de viajes
    atributos: {
      transporte: atributos.transporte || '',
      pais: atributos.pais || '',
      ciudad: atributos.ciudad || '',
      clima: atributos.clima || '',
      presupuesto: atributos.presupuesto || null,
      duracionDias: atributos.duracionDias || null
    },
    activo: true
  }
}

// para archivar un destino sin borrarlo
export function archivarDestino(destino) {
  return { ...destino, activo: false }
}