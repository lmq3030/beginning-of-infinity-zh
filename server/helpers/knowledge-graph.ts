import {KnowledgeGraph, KnowledgeGraphEdge} from 'app/interfaces/knowledge-graph'
import {getNotes} from 'server/helpers/notes-cache'

const backlinkPattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g

const extractBacklinks = (markdown: string) => {
  const links = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = backlinkPattern.exec(markdown)) !== null) {
    links.add(match[1].trim())
  }

  return Array.from(links)
}

export const getKnowledgeGraph = async (): Promise<KnowledgeGraph> => {
  const notes = await getNotes()
  const notePaths = new Set(notes.map((note) => note.path))
  const edgeKeys = new Set<string>()
  const edges: KnowledgeGraphEdge[] = []
  const degreeByPath = new Map(notes.map((note) => [note.path, 0]))

  for (const note of notes) {
    for (const target of extractBacklinks(note.markdown)) {
      if (!notePaths.has(target) || target === note.path) continue

      const key = `${note.path}->${target}`
      if (edgeKeys.has(key)) continue

      edgeKeys.add(key)
      edges.push({source: note.path, target})
      degreeByPath.set(note.path, (degreeByPath.get(note.path) || 0) + 1)
      degreeByPath.set(target, (degreeByPath.get(target) || 0) + 1)
    }
  }

  return {
    nodes: notes
      .map((note) => ({
        path: note.path,
        title: note.title,
        snippet: note.snippet,
        degree: degreeByPath.get(note.path) || 0,
      }))
      .sort((a, b) => b.degree - a.degree || a.title.localeCompare(b.title)),
    edges,
  }
}
