import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/Ticketplus-public/', // DEBE estar entre barras (ej: /ticketplus-publico/)
  server: {
    port: 5174 // Puerto local distinto para correr ambos a la vez
  }
})