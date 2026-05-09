import {KnowledgeGraph} from 'app/interfaces/knowledge-graph'

export const getKnowledgeGraph = async (): Promise<KnowledgeGraph> => {
  const request = await fetch('/api/graph')

  if (request.status !== 200) {
    throw new Error(`Unknown status code: ${request.status}`)
  }

  return request.json()
}
