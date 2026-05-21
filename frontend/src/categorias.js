export const CATEGORIAS_VIAJE = [
    {
        id: 'ciudad',
        nombre: 'Ciudad',
        color: '#5b8dee'
    },
    {
        id: 'naturaleza',
        nombre: 'Naturaleza',
        color: '#4caf82'
    },
    {
        id: 'historico',
        nombre: 'Histórico',
        color: '#c4973a'
    },
    {
        id: 'gastronomico',
        nombre: 'Gastronómico',
        color: '#e05c5c'
    }
]

export function obtenerCategoria(idCategoria) {
    return CATEGORIAS_VIAJE.find(cat => cat.id === idCategoria) || null
}