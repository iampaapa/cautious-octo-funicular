/** @type {import('postcss-load-config').Config} */
const path = require('path')

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.config.ts')
    },
    autoprefixer: {},
  },
}
