# ✈️ ProyectoViajesWeb
Aplicación web Full Stack para registrar viajes personales, la cual se construye con React + Express, 
siendo el proyecto final de Sistemas y tecnologías web.

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
# editar .env
npm run dev
```

 ## Mis primeros destinos
![Captura de mis destinos](https://github.com/IsmaLovesU/ProyectoViajesWeb/blob/85155ef2a12c0fea3b3974398358cab9bde14f66/imagen_2026-05-31_000902564.png)

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

 ## Fases del proyecto
 
- **Fase 1** useState + useEffect + Backend Express base
- **Fase 2** useContext híbrido + useRef
- **Fase 3** useReducer + Gráficas
- **Fase 4** Custom hooks + Deploy
