import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

import { minify } from 'terser'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function minifyFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  const result = await minify(code, {
    compress: {
      drop_console: true,
      drop_debugger: true,
      passes: 3
    },
    mangle: {
      toplevel: true
    },
    format: {
      comments: false
    }
  })

  fs.writeFileSync(filePath, result.code)
  console.log(`Minified: ${filePath}`)
}

async function minifyBuild() {
  const distPath = join(__dirname, './dist')
  const files = fs.readdirSync(distPath)

  for (const file of files) {
    if (file.endsWith('.js') && !file.endsWith('.min.js')) {
      await minifyFile(join(distPath, file))
    }
  }
}

minifyBuild().catch(console.error)
