import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src'),
       '@components': path.resolve(__dirname, 'src/components'),
       '@modules': path.resolve(__dirname, 'src/components/modules'),
      '@contexts': path.resolve(__dirname, 'src/components/contexts'),
      '@layouts': path.resolve(__dirname, 'src/components/layouts'),
      '@forms': path.resolve(__dirname, 'src/components/forms'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@login': path.resolve(__dirname, 'src/components/login'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@styles': path.resolve(__dirname, 'src/assets/styles'),
      '@images': path.resolve(__dirname, 'src/assets/images'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@png': path.resolve(__dirname, 'src/assets/png'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@hooks': path.resolve(__dirname, 'src/lib/api/hooks'),
      '@models': path.resolve(__dirname, 'src/lib/api/models'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@router': path.resolve(__dirname, 'src/router'),
    }
  }
})
