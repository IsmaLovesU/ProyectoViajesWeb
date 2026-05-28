export const CATEGORIAS_VIAJE = [
    { id: 'ciudad', nombre: 'Ciudad', emoji: '🏙️', color: '#5b8dee' },
    { id: 'naturaleza', nombre: 'Naturaleza', emoji: '🌿', color: '#4caf82' },
    { id: 'historico', nombre: 'Histórico', emoji: '🏛️', color: '#c4973a' },
    { id: 'gastronomico', nombre: 'Gastronómico', emoji: '🍜', color: '#e05c5c' },
]

export function obtenerCategoria(idCategoria) {
    return CATEGORIAS_VIAJE.find(cat => cat.id === idCategoria) || null
}