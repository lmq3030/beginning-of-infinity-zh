import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceRadial,
  forceSimulation,
  forceX,
  forceY,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from 'd3-force'
import {
  KnowledgeGraph as KnowledgeGraphData,
  KnowledgeGraphNode,
} from 'app/interfaces/knowledge-graph'
import {getKnowledgeGraph} from 'app/client/knowledge-graph'
import {NoteMarkdown} from './note-markdown'

const graphWidth = 1040
const graphHeight = 660
const graphPadding = 48
const goldenAngle = Math.PI * (3 - Math.sqrt(5))
const centerX = graphWidth / 2
const centerY = graphHeight / 2

interface ForceNode extends KnowledgeGraphNode, SimulationNodeDatum {
  x: number
  y: number
  radius: number
}

interface ForceEdge extends SimulationLinkDatum<ForceNode> {
  source: string | ForceNode
  target: string | ForceNode
}

interface ForceGraph {
  nodes: ForceNode[]
  edges: ForceEdge[]
  nodeByPath: Map<string, ForceNode>
  neighborPaths: Map<string, Set<string>>
}

const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value))
}

const shortTitle = (title: string) => {
  const cleanTitle = title.replace(/（.*?）/g, '').replace(/[《》]/g, '')

  return cleanTitle.length > 9 ? `${cleanTitle.slice(0, 9)}...` : cleanTitle
}

const noteUrl = (path: string) => `/${encodeURIComponent(path)}`

const nodeRadius = (node: KnowledgeGraphNode) => {
  if (node.path === 'Preface') return 15
  if (node.degree >= 8) return 12
  if (node.degree >= 5) return 10
  if (node.degree >= 3) return 8

  return 5
}

const nodeColor = (node: KnowledgeGraphNode) => {
  if (node.path === 'Preface') return '#2563eb'
  if (node.degree >= 6) return '#0f766e'
  if (node.degree >= 3) return '#334155'
  return '#94a3b8'
}

const edgePath = (edge: ForceEdge) => {
  const sourcePath =
    typeof edge.source === 'object' ? edge.source.path : String(edge.source)
  const targetPath =
    typeof edge.target === 'object' ? edge.target.path : String(edge.target)

  return `${sourcePath}->${targetPath}`
}

const getEndpointNode = (
  endpoint: string | number | ForceNode | undefined,
  nodeByPath: Map<string, ForceNode>,
) => {
  if (!endpoint) return null
  if (typeof endpoint === 'object') return endpoint

  return nodeByPath.get(String(endpoint)) || null
}

const isIncidentEdge = (edge: ForceEdge, path?: string) => {
  if (!path) return false

  const sourcePath =
    typeof edge.source === 'object' ? edge.source.path : String(edge.source)
  const targetPath =
    typeof edge.target === 'object' ? edge.target.path : String(edge.target)

  return sourcePath === path || targetPath === path
}

const createForceGraph = (graph: KnowledgeGraphData): ForceGraph => {
  const maxDegree = Math.max(...graph.nodes.map((node) => node.degree), 1)
  const nodes = graph.nodes.map((node, index) => {
    const degreeRatio = node.degree / maxDegree
    const ringDistance =
      node.path === 'Preface'
        ? 0
        : 100 +
          Math.sqrt((index + 1) / graph.nodes.length) * 260 +
          (1 - degreeRatio) * 110
    const angle = index * goldenAngle

    return {
      ...node,
      radius: nodeRadius(node),
      x: centerX + Math.cos(angle) * ringDistance,
      y: centerY + Math.sin(angle) * ringDistance,
    }
  })

  const edges = graph.edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
  }))
  const nodeByPath = new Map(nodes.map((node) => [node.path, node]))
  const neighborPaths = new Map(nodes.map((node) => [node.path, new Set<string>()]))

  for (const edge of graph.edges) {
    neighborPaths.get(edge.source)?.add(edge.target)
    neighborPaths.get(edge.target)?.add(edge.source)
  }

  return {nodes, edges, nodeByPath, neighborPaths}
}

const shouldShowLabel = (
  node: ForceNode,
  focusPath: string | undefined,
  neighborPaths: Map<string, Set<string>>,
) => {
  if (!focusPath) return node.path === 'Preface' || node.degree >= 4
  if (node.path === focusPath) return true

  return node.degree >= 5 || !!neighborPaths.get(focusPath)?.has(node.path)
}

export const KnowledgeGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const simulationRef = useRef<Simulation<ForceNode, ForceEdge> | null>(null)
  const draggedNodeRef = useRef<ForceNode | null>(null)
  const dragStartRef = useRef<{x: number; y: number} | null>(null)
  const dragMovedRef = useRef(false)

  const [open, setOpen] = useState(false)
  const [graph, setGraph] = useState<KnowledgeGraphData | null>(null)
  const [hoveredPath, setHoveredPath] = useState<string | undefined>()
  const [selectedPath, setSelectedPath] = useState<string | undefined>()
  const [draggedPath, setDraggedPath] = useState<string | undefined>()
  const [layoutSeed, setLayoutSeed] = useState(0)
  const [, setLayoutTick] = useState(0)
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

  const forceGraph = useMemo(
    () => (graph ? createForceGraph(graph) : null),
    [graph, layoutSeed],
  )

  useEffect(() => {
    if (!forceGraph) return

    simulationRef.current?.stop()

    let animationFrame = 0
    const renderNextFrame = () => {
      if (animationFrame) return

      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0
        setLayoutTick((tick) => tick + 1)
      })
    }

    const simulation = forceSimulation<ForceNode>(forceGraph.nodes)
      .force(
        'link',
        forceLink<ForceNode, ForceEdge>(forceGraph.edges)
          .id((node) => node.path)
          .distance((edge) => {
            const source = getEndpointNode(edge.source, forceGraph.nodeByPath)
            const target = getEndpointNode(edge.target, forceGraph.nodeByPath)
            const degree = ((source?.degree || 0) + (target?.degree || 0)) / 2

            if (degree >= 7) return 78
            if (degree >= 3) return 102

            return 132
          })
          .strength((edge) => {
            const source = getEndpointNode(edge.source, forceGraph.nodeByPath)
            const target = getEndpointNode(edge.target, forceGraph.nodeByPath)
            const degree = Math.max(source?.degree || 0, target?.degree || 0)

            return clamp(0.17 + degree * 0.018, 0.18, 0.42)
          }),
      )
      .force(
        'charge',
        forceManyBody<ForceNode>()
          .strength((node) => -165 - node.degree * 22)
          .distanceMax(520),
      )
      .force(
        'collide',
        forceCollide<ForceNode>()
          .radius((node) => node.radius + (node.degree >= 4 ? 35 : 24))
          .strength(0.9)
          .iterations(2),
      )
      .force(
        'radial',
        forceRadial<ForceNode>(
          (node) => {
            const maxRadius = Math.min(graphWidth, graphHeight) * 0.43
            if (node.path === 'Preface') return 0
            if (node.degree >= 7) return maxRadius * 0.4
            if (node.degree >= 3) return maxRadius * 0.66

            return maxRadius
          },
          centerX,
          centerY,
        ).strength(0.06),
      )
      .force('center', forceCenter(centerX, centerY))
      .force('x', forceX<ForceNode>(centerX).strength(0.02))
      .force('y', forceY<ForceNode>(centerY).strength(0.02))
      .alpha(0.95)
      .alphaDecay(0.035)
      .on('tick', () => {
        for (const node of forceGraph.nodes) {
          node.x = clamp(node.x || centerX, graphPadding, graphWidth - graphPadding)
          node.y = clamp(node.y || centerY, graphPadding, graphHeight - graphPadding)
        }

        renderNextFrame()
      })

    simulationRef.current = simulation

    return () => {
      simulation.stop()
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      if (simulationRef.current === simulation) simulationRef.current = null
    }
  }, [forceGraph])

  const focusPath = hoveredPath || selectedPath
  const detailPath = selectedPath || hoveredPath
  const activeNode = useMemo(() => {
    if (!graph) return null

    return (
      graph.nodes.find((node) => node.path === detailPath) ||
      graph.nodes.find((node) => node.path === 'Preface') ||
      graph.nodes[0]
    )
  }, [detailPath, graph])
  const importantNodes = useMemo(() => graph?.nodes.slice(0, 8) || [], [graph])

  const pointFromPointer = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return null

    const point = svg.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY

    const screenMatrix = svg.getScreenCTM()
    if (!screenMatrix) return null

    const graphPoint = point.matrixTransform(screenMatrix.inverse())

    return {
      x: clamp(graphPoint.x, graphPadding, graphWidth - graphPadding),
      y: clamp(graphPoint.y, graphPadding, graphHeight - graphPadding),
    }
  }, [])

  const onNodePointerDown = useCallback(
    (event: React.PointerEvent<SVGGElement>, node: ForceNode) => {
      if (event.button !== 0) return

      event.preventDefault()
      event.stopPropagation()
      draggedNodeRef.current = node
      dragStartRef.current = {x: event.clientX, y: event.clientY}
      dragMovedRef.current = false
      node.fx = node.x
      node.fy = node.y
      setDraggedPath(node.path)
      setHoveredPath(node.path)
      setSelectedPath(node.path)
      svgRef.current?.setPointerCapture(event.pointerId)
      simulationRef.current?.alphaTarget(0.22).restart()
    },
    [],
  )

  const onGraphPointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const node = draggedNodeRef.current
      if (!node) return

      const point = pointFromPointer(event)
      if (!point) return

      const dragStart = dragStartRef.current
      if (
        dragStart &&
        Math.hypot(event.clientX - dragStart.x, event.clientY - dragStart.y) > 3
      ) {
        dragMovedRef.current = true
      }

      node.fx = point.x
      node.fy = point.y
      node.x = point.x
      node.y = point.y
      simulationRef.current?.alphaTarget(0.22).restart()
      setLayoutTick((tick) => tick + 1)
    },
    [pointFromPointer],
  )

  const stopDragging = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    const node = draggedNodeRef.current
    if (!node) return

    node.fx = node.x
    node.fy = node.y
    draggedNodeRef.current = null
    dragStartRef.current = null
    setDraggedPath(undefined)
    svgRef.current?.releasePointerCapture(event.pointerId)
    simulationRef.current?.alphaTarget(0)
  }, [])

  const resetLayout = () => {
    setHoveredPath(undefined)
    setSelectedPath(undefined)
    setDraggedPath(undefined)
    draggedNodeRef.current = null
    setLayoutSeed((seed) => seed + 1)
  }

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
            width: 'min(1180px, calc(100vw - 32px))',
            height: 'min(760px, calc(100vh - 96px))',
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="重新布局"
                title="重新布局"
                className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={resetLayout}
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a9 9 0 0 1-14.7 7" />
                  <path d="M3 12A9 9 0 0 1 17.7 5" />
                  <path d="M7 19H3v-4" />
                  <path d="M17 5h4v4" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="关闭知识网络"
                className="flex h-8 w-8 items-center justify-center rounded-md text-2xl leading-none text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:flex-row md:overflow-hidden">
            <div className="h-[460px] flex-none bg-slate-50 md:h-auto md:flex-1">
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

              {forceGraph && (
                <svg
                  ref={svgRef}
                  className="h-full w-full touch-none select-none"
                  viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                  role="img"
                  aria-label="知识节点连接图"
                  onPointerMove={onGraphPointerMove}
                  onPointerUp={stopDragging}
                  onPointerCancel={stopDragging}
                >
                  <rect
                    width={graphWidth}
                    height={graphHeight}
                    fill="#f8fafc"
                    onClick={() => {
                      setHoveredPath(undefined)
                      setSelectedPath(undefined)
                    }}
                  />

                  <g>
                    {forceGraph.edges.map((edge) => {
                      const source = getEndpointNode(edge.source, forceGraph.nodeByPath)
                      const target = getEndpointNode(edge.target, forceGraph.nodeByPath)
                      if (!source || !target) return null

                      const highlighted = isIncidentEdge(edge, focusPath)

                      return (
                        <line
                          key={edgePath(edge)}
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke={highlighted ? '#2563eb' : '#cbd5e1'}
                          strokeOpacity={highlighted || !focusPath ? 0.78 : 0.12}
                          strokeWidth={highlighted ? 2.4 : 1}
                        />
                      )
                    })}
                  </g>

                  <g>
                    {forceGraph.nodes.map((node) => {
                      const active = node.path === focusPath
                      const neighbor =
                        !!focusPath &&
                        !!forceGraph.neighborPaths.get(focusPath)?.has(node.path)
                      const dimmed = !!focusPath && !active && !neighbor
                      const textVisible = shouldShowLabel(
                        node,
                        focusPath,
                        forceGraph.neighborPaths,
                      )
                      const dragging = node.path === draggedPath

                      return (
                        <g
                          key={node.path}
                          transform={`translate(${node.x}, ${node.y})`}
                          onMouseEnter={() => setHoveredPath(node.path)}
                          onMouseLeave={() => {
                            if (!draggedNodeRef.current) setHoveredPath(undefined)
                          }}
                          onPointerDown={(event) => onNodePointerDown(event, node)}
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            if (dragMovedRef.current) {
                              dragMovedRef.current = false
                              return
                            }

                            setSelectedPath(node.path)
                          }}
                          onDoubleClick={() => {
                            window.location.href = noteUrl(node.path)
                          }}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <circle
                            r={active || dragging ? node.radius + 4 : node.radius}
                            fill={nodeColor(node)}
                            fillOpacity={dimmed ? 0.32 : 1}
                            stroke={active || dragging ? '#1d4ed8' : '#ffffff'}
                            strokeWidth={active || dragging ? 3 : 2}
                          />
                          {textVisible && (
                            <text
                              y={node.radius + 15}
                              textAnchor="middle"
                              fontSize={node.degree >= 5 || active ? 13 : 11}
                              fontWeight={node.degree >= 5 || active ? 700 : 600}
                              fill={dimmed ? '#94a3b8' : '#334155'}
                              opacity={dimmed ? 0.55 : 1}
                              paintOrder="stroke"
                              stroke="#f8fafc"
                              strokeWidth={4}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              {shortTitle(node.title)}
                            </text>
                          )}
                          <title>{node.title}</title>
                        </g>
                      )
                    })}
                  </g>
                </svg>
              )}
            </div>

            <aside className="flex-none overflow-y-auto border-t border-gray-200 p-5 md:w-80 md:border-l md:border-t-0 lg:w-96">
              {activeNode && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {activeNode.title}
                  </h3>
                  <div className="mt-2 max-h-80 overflow-y-auto pr-1 text-gray-600">
                    <NoteMarkdown markdown={activeNode.snippet} size="sm" />
                  </div>
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
                        onClick={(event) => {
                          event.preventDefault()
                          setSelectedPath(node.path)
                        }}
                        onDoubleClick={() => {
                          window.location.href = noteUrl(node.path)
                        }}
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
