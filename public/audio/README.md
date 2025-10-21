# Carpeta de audio

Coloca aquí tu archivo de música para que la aplicación lo reproduzca automáticamente.

Nombre recomendado: `mi-cancion.mp3`

Ruta resultante en la app: `/audio/mi-cancion.mp3`

Pasos:
1. Crea la carpeta `public/audio` (ya existe si ves este archivo).
2. Copia tu `mi-cancion.mp3` dentro de `public/audio/`.
3. Reinicia el servidor de desarrollo (si está corriendo) o recarga la página.

Notas:
- Muchos navegadores bloquean la reproducción automática hasta que el usuario interactúe con la página. Si el navegador bloquea el autoplay, verás un botón "Reproducir música" en la pantalla; pulsa el botón para iniciar la reproducción.
- Si quieres usar otro nombre de archivo, actualiza `src/App.jsx` -> `SONG.src` con la ruta correcta, p. ej. `/audio/otro-nombre.mp3`.
