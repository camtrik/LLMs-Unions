import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  },
  server: {
    proxy: {
      '/api/claude': {
        target: 'https://api.anthropic.com/v1/messages',
        changeOrigin: true,
        rewrite: (path) => '',
        configure: (proxy, options) => {
          // 你可以在这里添加额外的代理配置
        }
      }
    }
  }
})
