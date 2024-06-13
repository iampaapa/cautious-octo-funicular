import type { Config } from 'tailwindcss'
import { resolve } from 'node:path'

export default {
  content: [resolve(__dirname, './index.html'), resolve(__dirname, './src/**/*.{js,ts,jsx,tsx}')],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config
