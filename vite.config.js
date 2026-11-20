import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const inlineCssPlugin = () => ({
  name: 'inline-css-for-lcp',
  enforce: 'post',
  apply: 'build',
  transformIndexHtml(html, { bundle }) {
    if (!bundle) return html
    let result = html
    for (const [fileName, asset] of Object.entries(bundle)) {
      if (fileName.endsWith('.css') && asset.type === 'asset') {
        const escaped = fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const linkRegex = new RegExp(`<link[^>]*href="[^"]*${escaped}"[^>]*>`, 'i')
        result = result.replace(linkRegex, `<style>${asset.source}</style>`)
      }
    }
    return result
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCssPlugin()],
  build: {
    sourcemap: true,
    target: 'esnext',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tabler/icons-react')) return 'icons'
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype')) return 'markdown'
            if (id.includes('sweetalert2')) return 'alerts'
            return 'vendor'
          }
        },
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['src/main.jsx', 'src/setupTests.js'],
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
  },
})