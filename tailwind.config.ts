import type { Config } from 'tailwindcss'
import path from 'node:path'

export default {
  important: true,
  content: [
    path.resolve(__dirname, './index.html'),
    path.resolve(__dirname, './src/**/*.{js,ts,jsx,tsx}')
  ],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config