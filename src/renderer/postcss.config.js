/** @type {import('postcss-load-config').Config} */
const { join } = require('path')

module.exports = {
  plugins: {
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.ts')
    },
    autoprefixer: {}
  }
}
