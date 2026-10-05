import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const stylesDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(stylesDir, '../../..')
const packages = ['base', 'user', 'partner', 'enterprise', 'support']

const vueImportPattern = /@import\s+['"][^'"]*userProfilePanel\.scss['"]/

const listVueFiles = (dir: string, acc: string[] = []): string[] => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      listVueFiles(path, acc)
      continue
    }
    if (entry.name.endsWith('.vue')) acc.push(path)
  }
  return acc
}

describe('userProfilePanel.scss の読み込み', () => {
  it('SFC から userProfilePanel.scss を import しない', () => {
    const hits = packages.flatMap((pkg) => {
      const src = join(repoRoot, pkg, 'src')
      return listVueFiles(src)
        .filter((file) => vueImportPattern.test(readFileSync(file, 'utf8')))
        .map((file) => relative(repoRoot, file))
    })
    expect(hits).toEqual([])
  })

  it('base.scss から 1 回だけ読む', () => {
    const baseScss = readFileSync(join(stylesDir, 'base.scss'), 'utf8')
    const matches = baseScss.match(/userProfilePanel\.scss/g) ?? []
    expect(matches).toHaveLength(1)
  })
})
