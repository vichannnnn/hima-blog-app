import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({

  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
    'import.meta.env.VITE_IMAGE_VOLUME_URL': JSON.stringify(process.env.VITE_IMAGE_VOLUME_URL),
    plugins: [react()],
  },
});