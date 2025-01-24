import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Workshop_Sales/',
})

// export default defineConfig(({ mode }) => ({
  // plugins: [react()],
  // base: '/',
// }));
// base: mode === 'production' ? '/Workshop_Sales/' : '/',