/**
 * 構建驗證測試
 * 驗證 Next.js 構建過程成功完成並檢查無錯誤輸出
 * 需求: 1.2 - 構建過程執行時系統應成功完成構建而不出現錯誤
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'

describe('構建驗證測試', () => {
  let buildOutput: string
  let buildError: string | null = null

  beforeAll(async () => {
    try {
      // 執行 Next.js 構建命令
      buildOutput = execSync('npm run build', {
        encoding: 'utf8',
        cwd: process.cwd(),
        timeout: 300000, // 5 分鐘超時
      })
    } catch (error: any) {
      buildError = error.message
      buildOutput = error.stdout || ''
    }
  }, 300000) // 5 分鐘超時

  describe('構建過程驗證', () => {
    test('構建應該成功完成', () => {
      expect(buildError).toBeNull()
      expect(buildOutput).toBeDefined()
    })

    test('構建輸出不應包含錯誤信息', () => {
      // 檢查常見的錯誤關鍵字
      const errorKeywords = [
        'Error:',
        'TypeError:',
        'SyntaxError:',
        'ReferenceError:',
        'Failed to compile',
        'Build failed',
        'error TS',
      ]

      errorKeywords.forEach(keyword => {
        expect(buildOutput.toLowerCase()).not.toContain(keyword.toLowerCase())
      })
    })

    test('構建應該生成必要的輸出文件', () => {
      // 檢查 .next 目錄是否存在
      expect(existsSync('.next')).toBe(true)
      
      // 檢查構建清單文件
      expect(existsSync('.next/build-manifest.json')).toBe(true)
      
      // 檢查靜態文件目錄
      expect(existsSync('.next/static')).toBe(true)
    })

    test('構建清單應該包含有效的頁面路由', () => {
      const manifestPath = '.next/build-manifest.json'
      if (existsSync(manifestPath)) {
        const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
        
        // 檢查清單結構
        expect(manifest).toHaveProperty('pages')
        expect(typeof manifest.pages).toBe('object')
        
        // Next.js 15 App Router 使用不同的路由結構，檢查是否有任何頁面
        expect(Object.keys(manifest.pages).length).toBeGreaterThan(0)
      }
    })
  })

  describe('TypeScript 編譯驗證', () => {
    test('TypeScript 編譯不應有錯誤', () => {
      // 檢查 TypeScript 相關錯誤
      const tsErrors = [
        'error TS',
        'Type error:',
        'Cannot find module',
        'Property does not exist',
      ]

      tsErrors.forEach(error => {
        expect(buildOutput).not.toContain(error)
      })
    })
  })

  describe('ESLint 驗證', () => {
    test('ESLint 檢查不應有錯誤', () => {
      // 檢查 ESLint 錯誤
      const lintErrors = [
        'ESLint error:',
        'Linting errors found',
        'error  ',
        'Error: ',
      ]

      // 只檢查明確的 ESLint 錯誤，忽略警告
      const criticalErrors = lintErrors.filter(error => 
        buildOutput.includes(error) && !buildOutput.includes('warning')
      )

      expect(criticalErrors).toHaveLength(0)
    })
  })

  describe('構建性能驗證', () => {
    test('構建輸出應該包含成功信息', () => {
      const successIndicators = [
        'Compiled successfully',
        'Build completed',
        'Route (app)',
        'Size',
        'First Load JS',
        '✓ Compiled successfully',
        '✓ Linting and checking validity of types',
        '✓ Collecting page data',
        '✓ Generating static pages',
        '✓ Finalizing page optimization'
      ]

      const hasSuccessIndicator = successIndicators.some(indicator =>
        buildOutput.includes(indicator)
      )

      expect(hasSuccessIndicator).toBe(true)
    })

    test('構建不應該有記憶體洩漏警告', () => {
      const memoryWarnings = [
        'memory leak',
        'heap out of memory',
        'FATAL ERROR',
      ]

      memoryWarnings.forEach(warning => {
        expect(buildOutput.toLowerCase()).not.toContain(warning.toLowerCase())
      })
    })
  })

  describe('Next.js 配置驗證', () => {
    test('Next.js 配置文件應該存在且有效', () => {
      expect(existsSync('next.config.ts')).toBe(true)
    })

    test('package.json 應該包含必要的構建腳本', () => {
      const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
      
      expect(packageJson.scripts).toHaveProperty('build')
      expect(packageJson.scripts.build).toBe('next build')
    })
  })

  describe('構建輸出驗證', () => {
    test('應該生成靜態和動態路由', () => {
      // 檢查構建輸出是否包含路由信息
      expect(buildOutput).toContain('Route (app)')
      
      // 檢查是否有靜態頁面生成
      const staticRoutePattern = /○.*\/.*kB.*kB/
      const dynamicRoutePattern = /ƒ.*\/.*kB.*kB/
      
      const hasStaticRoutes = staticRoutePattern.test(buildOutput)
      const hasDynamicRoutes = dynamicRoutePattern.test(buildOutput)
      
      // 至少應該有靜態或動態路由之一
      expect(hasStaticRoutes || hasDynamicRoutes).toBe(true)
    })

    test('應該顯示 bundle 大小信息', () => {
      // 檢查是否包含 bundle 大小信息
      expect(buildOutput).toContain('First Load JS')
      expect(buildOutput).toContain('kB')
    })
  })
})