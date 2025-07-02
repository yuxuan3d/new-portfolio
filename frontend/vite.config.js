import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  // Log available environment variables (excluding sensitive data)
  console.log('Available Vite Env Variables:', {
    MODE: mode,
    VITE_VARS_PRESENT: Object.keys(env).filter(key => key.startsWith('VITE_')).join(', ')
  })

  return {
    plugins: [react()],
    define: {
      // Ensure environment variables are properly stringified
      'import.meta.env.VITE_SANITY_PROJECT_ID': JSON.stringify(env.VITE_SANITY_PROJECT_ID || '5gu0ubge'),
      'import.meta.env.VITE_SANITY_DATASET': JSON.stringify(env.VITE_SANITY_DATASET || 'production'),
      'import.meta.env.VITE_SANITY_API_VERSION': JSON.stringify(env.VITE_SANITY_API_VERSION || '2024-03-14')
    }
  }
})
