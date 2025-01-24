import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/Workshop_Sales/',
}));
// base: mode === 'production' ? '/Workshop_Sales/' : '/',