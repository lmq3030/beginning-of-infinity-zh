import React, {useEffect, useMemo, useState} from 'react'
import {
  KnowledgeGraph as KnowledgeGraphData,
  KnowledgeGraphEdge,
  KnowledgeGraphNode,
} from 'app/interfaces/knowledge-graph'
import {getKnowledgeGraph} from 'app/client/knowledge-graph'

const graphWidth = 940
const graphHeight = 620
const graphPadding = 52
const goldenAngle = Math.PI * (3 - Math.sqrt(5))

interface PositionedNode extends KnowledgeGraphNode {
  x: number
  y: number
  radius: number
}

interface PositionedGraph {
  nodes: PositionedNode[]
  edges: KnowledgeGraphEdge[]
  nodeByPath: Map<string, PositionedNode>
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value))
}

const shortTitle = (title: string) => {
  const cleanTitle = title.replace(/（.*?）/g, '').replace(/[《》]/g, '')

  return cleanTitle.length > 9 ? `${cleanTitle.slice(0, 9)}…` : cleanTitle
}

const noteUrl = (path: string) => `/${encodeURIComponent(path)}`

const buildLayout = (graph: KnowledgeGraphData): PositionedGraph => {
  const centerX = graphWidth / 2
  const centerY = graphHeight / 2
  const maxDegree = Math.max(...graph.nodes.map((node) => node.degree), 1)

  const nodes = graph.nodes.map((node, index) => {
    const radiusBias = 1 - node.degree / maxDegree
    const distance =
      node.path === 'Preface'
        ? 0
        : 82 + Math.sqrt((index + 1) / graph.nodes.length) * 255 + radiusBias * 90
    const angle = index * goldenAngle

    return {
      ...node,
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      radius: 4 + Math.sqrt(node.degree + 1) * 2,
    }
  })

  const nodeByPath = new Map(nodes.map((node) => [node.path, node]))
  const velocities = new Map(nodes.map((node) => [node.path, {x: 0, y: 0}]))

  for (let tick = 0; tick < 280; tick++) {
    for (let a = 0; a < nodes.length; a++) {
      for (let b = a + 1; b < nodes.length; b++) {
        const source = nodes[a]
        const target = nodes[b]
        const dx = target.x - source.x
        const dy = target.y - source.y
        const distanceSquared = Math.max(dx * dx + dy * dy, 64)
        const distance = Math.sqrt(distanceSquared)
        const force = 4300 / distanceSquared
        const forceX = (dx / distance) * force
        const forceY = (dy / distance) * force

        velocities.get(source.path)!.x -= forceX
        velocities.get(source.path)!.y -= forceY
        velocities.get(target.path)!.x += forceX
        velocities.get(target.path)!.y += forceY
      }
    }

    for (const edge of graph.edges) {
      const source = nodeByPath.get(edge.source)
      const target = nodeByPath.get(edge.target)
      if (!source || !target) continue

      const dx = target.x - source.x
      const dy = target.y - source.y
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1)
      const desiredDistance = 86 + Math.max(source.radius, target.radius) * 3
      const force = (distance - desiredDistance) * 0.006
      const forceX = (dx / distance) * force
      const forceY = (dy / distance) * force

      velocities.get(source.path)!.x += forceX
      velocities.get(source.path)!.y += forceY
      velocities.get(target.path)!.x -= forceX
      velocities.get(target.path)!.y -= forceY
    }

    for (const node of nodes) {
      const velocity = velocities.get(node.path)!

      velocity.x += (centerX - node.x) * 0.004
      velocity.y += (centerY - node.y) * 0.004
      velocity.x *= 0.82
      velocity.y *= 0.82

      node.x = clamp(node.x + velocity.x, graphPadding, graphWidth - graphPadding)
      node.y = clamp(node.y + velocity.y, graphPadding, graphHeight - graphPadding)
    }
  }

  return {
    nodes,
    edges: graph.edges,
    nodeByPath,
  }
}

const isIncidentEdge = (edge: KnowledgeGraphEdge, path?: string) => {
  return path ? edge.source === path || edge.target === path : false
}

const nodeColor = (node: KnowledgeGraphNode) => {
  if (node.path === 'Preface') return '#2563eb'
  if (node.degree >= 6) return '#0f766e'
  if (node.degree >= 3) return '#475569'
  return '#94a3b8'
}

export const KnowledgeGraph: React.FC = () => {
  const [open, setOpen] = useState(false)
  const [graph, setGraph] = useState<KnowledgeGraphData | null>(null)
  const [hoveredPath, setHoveredPath] = useState<string | undefined>()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!open || graph || error) return

    getKnowledgeGraph()
      .then(setGraph)
      .catch(() => setError(true))
  }, [error, graph, open])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const positionedGraph = useMemo(() => (graph ? buildLayout(graph) : null), [graph])
  const activeNode = useMemo(() => {
    if (!graph) return null
    return graph.nodes.find((node) => node.path === hoveredPath) || graph.nodes[0]
  }, [graph, hoveredPath])

  const importantNodes = useMemo(() => graph?.nodes.slice(0, 8) || [], [graph])

  return (
    <>
      <button
        type="button"
        aria-label="打开知识网络"
        title="知识网络"
        className="fixed bottom-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 shadow-lg transition hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          aria-hidden="true"
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 8.5l5 3.5 5-3.5" />
          <path d="M7 15.5l5-3.5 5 3.5" />
          <circle cx="5" cy="7" r="2.5" />
          <circle cx="19" cy="7" r="2.5" />
          <circle cx="12" cy="17" r="2.5" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed bottom-16 right-4 z-30 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-2xl"
          style={{
            width: 'min(980px, calc(100vw - 32px))',
            height: 'min(720px, calc(100vh - 96px))',
          }}
        >
          <div className="flex h-14 flex-none items-center justify-between border-b border-gray-200 px-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">知识网络</h2>
              {graph && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {graph.nodes.length} 个概念 · {graph.edges.length} 条连接
                </p>
              )}
            </div>

            <button
              type="button"
              aria-label="关闭知识网络"
              className="flex h-8 w-8 items-center justify-center rounded-md text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
            <div className="h-[430px] flex-none bg-slate-50 md:h-auto md:flex-1">
              {!graph && !error && (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  加载中...
                </div>
              )}

              {error && (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  知识网络暂时无法加载。
                </div>
              )}

              {positionedGraph && (
                <svg
                  className="h-full w-full"
                  viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                  role="img"
                  aria-label="知识节点连接图"
                >
                  <rect width={graphWidth} height={graphHeight} fill="#f8fafc" />

                  {positionedGraph.edges.map((edge) => {
                    const source = positionedGraph.nodeByPath.get(edge.source)
                    const target = positionedGraph.nodeByPath.get(edge.target)
                    if (!source || !target) return null

                    const highlighted = isIncidentEdge(edge, hoveredPath)

                    return (
                      <line
                        key={`${edge.source}->${edge.target}`}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={highlighted ? '#2563eb' : '#cbd5e1'}
                        strokeOpacity={highlighted || !hoveredPath ? 0.85 : 0.16}
                        strokeWidth={highlighted ? 2.2 : 1}
                      />
                    )
                  })}

                  {positionedGraph.nodes.map((node) => {
                    const active = node.path === hoveredPath
                    const dimmed = hoveredPath && !active
                    const textVisible = node.degree >= 2 || active

                    return (
                      <g
                        key={node.path}
                        onMouseEnter={() => setHoveredPath(node.path)}
                        onMouseLeave={() => setHoveredPath(undefined)}
                        onClick={() => {
                          window.location.href = noteUrl(node.path)
                        }}
                        className="cursor-pointer"
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={active ? node.radius + 3 : node.radius}
                          fill={nodeColor(node)}
                          fillOpacity={dimmed ? 0.45 : 1}
                          stroke={active ? '#1d4ed8' : '#ffffff'}
                          strokeWidth={active ? 3 : 2}
                        />
                        <text
                          x={node.x}
                          y={node.y + node.radius + 13}
                          textAnchor="middle"
                          fontSize={node.degree >= 5 ? 13 : 11}
                          fontWeight={node.degree >= 5 ? 600 : 500}
                          fill={dimmed ? '#94a3b8' : '#334155'}
                          opacity={textVisible ? 1 : 0.62}
                        >
                          {shortTitle(node.title)}
                        </text>
                        <title>{node.title}</title>
                      </g>
                    )
                  })}
                </svg>
              )}
            </div>

            <aside className="flex-none border-t border-gray-200 p-5 md:w-64 md:border-l md:border-t-0">
              {activeNode && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {activeNode.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {activeNode.snippet}
                  </p>
                  <a
                    className="mt-3 inline-block text-sm font-medium text-blue-600"
                    href={noteUrl(activeNode.path)}
                  >
                    打开这条笔记
                  </a>
                </div>
              )}

              {!!importantNodes.length && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    高连接概念
                  </h3>
                  <div className="mt-3 space-y-2">
                    {importantNodes.map((node) => (
                      <a
                        key={node.path}
                        href={noteUrl(node.path)}
                        onMouseEnter={() => setHoveredPath(node.path)}
                        onMouseLeave={() => setHoveredPath(undefined)}
                        className="block rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      >
                        <span className="font-medium">{shortTitle(node.title)}</span>
                        <span className="ml-2 text-xs text-gray-400">{node.degree}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      )}
    </>
  )
}
