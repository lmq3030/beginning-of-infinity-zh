export interface KnowledgeGraphNode {
  path: string
  title: string
  snippet: string
  degree: number
}

export interface KnowledgeGraphEdge {
  source: string
  target: string
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[]
  edges: KnowledgeGraphEdge[]
}
