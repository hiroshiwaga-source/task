import { copyFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

/** GitHub Pages 用: 存在しないパスでも SPA の index を返す（404.html に index と同内容を置く） */
function githubPagesSpaFallback(): Plugin {
  let outDir = 'dist'
  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const root = join(process.cwd(), outDir)
      const index = join(root, 'index.html')
      const notFound = join(root, '404.html')
      if (existsSync(index)) {
        copyFileSync(index, notFound)
      }
    },
  }
}

// GitHub Pages のプロジェクトサイトは /<リポジトリ名>/ がベース（本リポジトリ名: task）
// https://vite.dev/guide/build.html#public-base-path
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/task/' : '/',
  plugins: [react(), githubPagesSpaFallback()],
}))
