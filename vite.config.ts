import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages のプロジェクトサイトは /<リポジトリ名>/ がベース（本リポジトリ名: task）
// https://vite.dev/guide/build.html#public-base-path
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/task/' : '/',
  plugins: [react()],
}))
