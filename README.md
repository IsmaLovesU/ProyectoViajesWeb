# ✈️ ProyectoViajesWeb
Aplicación web Full Stack para registrar viajes personales, la cual se construyó con React + Express, 
siendo el proyecto final de Sistemas y tecnologías web.

### Enlace a Video:
[Video](https://youtu.be/09Cl6ueVnCc)

### Enlace a Demo:
[viajes-frontend.vercel.app](https://proyecto-viajes-web-wa63.vercel.app)

### Enlace a API:
[viajes-backend.onrender.com](https://viajes-backend-0mdv.onrender.com)

## Screenshots
 
### Modo claro — Vista principal
![Modo claro](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/16f8818fe99d6da0e5cb2a836071a0bb06d5e2bb/images/ModoClaro.png)
 
### Modo oscuro — Vista principal
![Modo oscuro](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/16f8818fe99d6da0e5cb2a836071a0bb06d5e2bb/images/ModoOscuro.png)
 
### Panel de estadísticas con gráficas
![Estadística](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/16f8818fe99d6da0e5cb2a836071a0bb06d5e2bb/images/ModoEstadistica.png)

## Stack tecnológico
 
| Parte | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18.3.1 |
| Build tool | Vite | 5.4.x |
| Gráficas | Recharts | 3.8.1 |
| Backend | Express | 4.19.x |
| Base de datos | PostgreSQL | 15+ |
| ORM/Driver | pg (node-postgres) | 8.11.x |
| Deploy frontend | Vercel | — |
| Deploy backend | Render | — |


## Cómo correr el proyecto localmente
 
### Requisitos previos
- Node.js 18+
- PostgreSQL instalado y corriendo
  
### 1. Clonar el repositorio
```bash
git clone https://github.com/usuarioDeGitHub/ProyectoViajesWeb.git
cd ProyectoViajesWeb
```
 
### 2. Configurar el backend
```bash
cd backend
npm install
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de PostgreSQL:
 
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://TU_USUARIO:TU_CONTRASENA@localhost:5432/viajes_db
```
Luego levantar el servidor:
 
```bash
npm run dev
```

### 3. Configurar el frontend
 
Abre otra terminal:
 
```bash
cd frontend
npm install
npm run dev
```
 
El frontend estará disponible en `http://localhost:5173`.

## Fase 1 y 2: useContext

### Mis primeros destinos
![Captura de mis destinos](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/2709ef3557f53daf28273addc7b2ca3405173e7b/images/imagen_2026-05-31_000902564.png)

## Mi paleta de colores
 
### Tema Claro

- `--color-fondo`  `#f5f3ee` Blanco cálido, ya que reduce el contraste duro del blanco puro y hace la lectura más agradable, mejorando así la interfaz hací el usuario.
- `--color-superficie` `#ffffff` Blanco puro para tarjetas y formularios que necesitan máximo contraste respecto al fondo, de forma que exista comodida visual.
- `--color-tarjeta` `#faf8f4` Crema muy suave, un escalón entre el fondo y la superficie, para poder diferenciar las tarjetas del resto sin usar sombras agresivas.
- `--color-borde` `#ddd8ce` Tono arena para los bordes que deben separar sin llamar la atención, de forma que no rompan el orden de jerarquía visual.
- `--color-principal` `#b07d2a` Color negro para maximizar el contraste con los fondos y superficie, así mismo hace buen conjunto con el font "Cal Sans".
- `--color-acento` `#3b6fd4` Azul viajero intenso, contraste sobre fondo claro, ya que el azul conecta con destinos, agua y cielo, refuerza el tema sin discordar.
 
### Tema Oscuro

- `--color-fondo` `#0f1117` Negro azulado casi puro, reduce la fatiga visual nocturna mejor que el negro total, el tinte azul mantiene coherencia con el acento del tema.
- `--color-superficie` `#1a1d27` Primer nivel de elevación sobre el fondo oscuro. La diferencia sutil crea profundidad sin ser disruptiva.
- `--color-tarjeta` `#21253a` Azul marino profundo para tarjetas, da una sensación de profundidad oceanica que refuerza el tema de viajes nocturnos.
- `--color-borde` `#2e3451` Línea de separación perceptible pero discreta sobre fondos oscuros, suficientemente claro para verse, lo bastante oscuro para no competir.
- `--color-principal` `#e8c97a` Dorado suave adaptado a fondos oscuros; mantiene el carácter del tema claro pero con luminosidad reducida para no saturar.
- `--color-acento` `#5b8dee` Azul viajero más claro en modo oscuro, ajustado para mantener contraste sobre los fondos del tema oscuro.

## Fase 3: useReducer, Recharts y optimizacion

### Graficas con Recharts

Las graficas aparecen al hacer click en el boton `Estadisticas` y reaccionan a los filtros activos.

- Actividad de los ultimos 7 dias.
- Distribucion de destinos por categoria.
- La grafica original es `Presupuesto promedio por categoria`. La elegi porque en una app de viajes no solo importa cuantos destinos hay, sino tambien que tipo de viaje requiere mayor inversion promedio.

### Capturas
![Estadistica1](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/4b1c2d541cfb19aa8d600b34d5d39c596f347bc2/images/Estadisticas1.png)
![Estadistica2](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/4b1c2d541cfb19aa8d600b34d5d39c596f347bc2/images/Estadisticas2.png)

## Optimizacion aplicada

Se usa `useMemo` para la lista filtrada, estadisticas generales y datos derivados para graficas.

Se usa `useCallback` para handlers que se pasan a componentes hijos, como editar, archivar, cambiar estado y actualizar filtros.

`TarjetaDestino` se exporta con `React.memo` para evitar renders innecesarios cuando sus props no cambian.

## Evidencia con React DevTools Profiler

### Antes:
![Antes](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/2709ef3557f53daf28273addc7b2ca3405173e7b/images/Antes.png)

### Despues:
![Despues](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/2709ef3557f53daf28273addc7b2ca3405173e7b/images/Despues.png)

Despues de memorizar la lista filtrada, estadisticas y datos de graficas, los calculos derivados solo se repiten cuando cambian `lista`, `filtroCategoria`, `filtroEstado` o `busqueda`. `TarjetaDestino` evita re-renderizar tarjetas cuyas props no cambiaron gracias a `React.memo` y handlers estables con `useCallback`.

### Mis 3 decisiones tecnicas

1. Estructura del reducer: separe las acciones de datos (`HIDRATAR`, `AGREGAR`, `ACTUALIZAR`, `ELIMINAR`) de las acciones de filtros (`FILTRAR`, `LIMPIAR_FILTROS`) y actividad (`REGISTRAR_ACTIVIDAD`).
2. Accion mas dificil: `CAMBIAR_ESTADO`, porque al volver un destino a pendiente debe permitir limpiar la puntuacion con `null` sin que el reducer conserve el valor anterior.
3. Grafica mas compleja: presupuesto promedio por categoria, porque transforma destinos filtrados, agrupa por categoria, descarta presupuestos vacios y calcula un promedio por grupo.

## Fase 4: Hooks usados
 
| Hook | Archivo | Qué hace |
|------|---------|----------|
| `useLocalStorage` | `src/hooks/useLocalStorage.js` | Envuelve `useState` + `useEffect` para sincronizar cualquier valor con `localStorage`. Soporta valores iniciales y JSON automático. |
| `useFetch` | `src/hooks/useFetch.js` | Fetch con estados `data / loading / error` + `AbortController` para cancelar peticiones al desmontar o cambiar URL. |
| `useAtajoTeclado` | `src/hooks/useAtajoTeclado.js` | Registra un listener `keydown` para un atajo específico con cleanup automático. Soporta `Ctrl`, ignora inputs opcionalmente. Reemplaza los `useEffect` manuales de `App.jsx` y `BotonTema.jsx`. |
| `useRacha` | `src/hooks/useRacha.js` | Hook de dominio: calcula la racha actual de días consecutivos con actividad (agregar, editar o visitar destinos). Devuelve `{ racha, activo, diasConActividad }`. |

## Sobre mí
 
| Campo |  |
|-------|-------|
| **Nombre** | Andrés Esteban Ismalej González |
| **Carnet** | 24005 |
| **Semestre** | 5to Semestre |
 
**Reflexión:** A lo largo de este proyecto entendí el uso de useReducer en lugar de useState, al igual que por qué los custom hooks existen más allá de "reutilizar código", ya que al construir cada fase desde cero me obligó a tomar decisiones reales. Los custom hooks dejaron de ser un concepto abstracto cuando tuve que escribir el JSDoc de useRacha y explicar exactamente qué recibe, qué calcula y qué devuelve. Para mi, el deploy fue la sorpresa más grande, porque siempre pensé que era algo para personas con más experiencia, lleno de configuraciones complicadas, pero resulta que conectar un repositorio de GitHub a Vercel toma literalmente dos minutos, y los errores que aparecieron (el CORS con la barra extra al final de la URL, la variable de entorno apuntando a la raíz en lugar de a /api/items) fueron problemas concretos con soluciones concretas, no cosas de otro mundo. Así mismo, ver la app corriendo en una URL pública real, con el backend en Render respondiendo desde una base de datos en producción, fue la primera vez que sentí que lo que construí existe y puede servrile a alguien.

---

 ## Fases del proyecto
 
- **Fase 1** useState + useEffect + Backend Express base
- **Fase 2** useContext híbrido + useRef
- **Fase 3** useReducer + Gráficas
- **Fase 4** Custom hooks + Deploy
