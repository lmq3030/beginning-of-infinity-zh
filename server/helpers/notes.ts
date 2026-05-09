import parseFrontMatter from 'front-matter'
import {Note, NotePreview, NOTE_INDEX_NAME} from 'app/interfaces/note'
import notesData from 'server/generated/notes-data.json'

interface NoteSource {
  path: string
  markdown: string
}

const noteSources = notesData as NoteSource[]

export const getNotes = async () => {
  return noteSources.map(readNote)
}

const readNote = (source: NoteSource): Note => {
  const {attributes, body} = parseFrontMatter<{
    title: string | undefined
    snippet: string | undefined
  }>(source.markdown)

  return {
    path: source.path,
    title: attributes?.title || markdownToTitle(body) || source.path,
    snippet: attributes?.snippet || markdownToSnippet(body),
    markdown: body,
    linkedFromNotes: [],
  }
}

const markdownToTitle = (markdown: string): string | undefined => {
  const heading = markdown.match(/^#{1,6}\s+(.+)$/m)?.[1]?.trim()

  if (!heading) return undefined

  return heading.replace(
    /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,
    (_match, path, label) => label || path,
  )
}

const markdownToSnippet = (markdown: string): string => {
  return markdown
    .replace(/^#.+/g, '')
    .split('\n')
    .filter((l) => l.trim())
    .slice(0, 2)
    .join(' ')
}

const noteToNotePreview = (note: Note): NotePreview => {
  return {
    path: note.path,
    title: note.title,
    snippet: markdownToSnippet(note.markdown),
  }
}

export const getHydratedNote = async (name: string): Promise<Note | null> => {
  const allNotes = await getNotes()
  const note = allNotes.find((n) => n.path === name)

  if (!note) return null

  const linkedFromNotes = allNotes
    .filter((n) => n != note && n.path != NOTE_INDEX_NAME)
    .filter((n) => hasBacklink(n.markdown, name))
    .map(noteToNotePreview)

  return {
    ...note,
    linkedFromNotes,
  }
}

const hasBacklink = (markdown: string, name: string): boolean => {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\[\\[${escapedName}(?:\\||\\]\\])`).test(markdown)
}

export const getNote = async (name: string): Promise<Note | null> => {
  const source = noteSources.find((note) => note.path === name)

  return source ? readNote(source) : null
}
