import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 3000, // Change to the port you prefer
  },
  plugins: [react()],
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
  },
});