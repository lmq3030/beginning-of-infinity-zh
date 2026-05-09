import {KnowledgeGraph} from 'app/interfaces/knowledge-graph'
import type {NextApiRequest, NextApiResponse} from 'next'
import {getKnowledgeGraph} from 'server/helpers/knowledge-graph'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<KnowledgeGraph>,
) {
  const graph = await getKnowledgeGraph()

  res.setHeader('Cache-Control', `max-age=0, s-maxage=${86400}`)
  res.status(200).json(graph)
}
