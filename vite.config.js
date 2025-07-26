import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // Make env variables available as process.env.VARIABLE_NAME
      'process.env': Object.keys(env).reduce((acc, key) => {
        acc[key] = JSON.stringify(env[key])
        return acc
      }, {})
    }
  }
})
