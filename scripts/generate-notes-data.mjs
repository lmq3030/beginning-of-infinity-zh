import fs from 'fs/promises'
import path from 'path'
import {fileURLToPath} from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const notesDir = path.join(root, 'notes')
const outputDir = path.join(root, 'server', 'generated')
const outputFile = path.join(outputDir, 'notes-data.json')

const noteNames = (await fs.readdir(notesDir))
  .filter((name) => name.endsWith('.md'))
  .sort((a, b) => a.localeCompare(b))

const notes = await Promise.all(
  noteNames.map(async (fileName) => ({
    path: fileName.replace(/\.md$/, ''),
    markdown: await fs.readFile(path.join(notesDir, fileName), 'utf8'),
  })),
)

await fs.mkdir(outputDir, {recursive: true})
await fs.writeFile(outputFile, `${JSON.stringify(notes, null, 2)}\n`)
