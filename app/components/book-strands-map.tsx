import clsx from 'clsx'
import Link from 'next/link'
import React, {useMemo, useState} from 'react'

type StrandId =
  | 'epistemology'
  | 'universality'
  | 'reality'
  | 'evolution'
  | 'society'

interface ConceptNode {
  id: string
  title: string
  english: string
  notePath?: string
  summary: string
  role: string
  angle: number
  radius?: number
}

interface Strand {
  id: StrandId
  title: string
  english: string
  color: string
  pale: string
  textColor: string
  center: {x: number; y: number}
  chapters: string[]
  question: string
  claim: string
  warning: string
  nodes: ConceptNode[]
}

interface CrossLink {
  source: StrandId
  target: StrandId
  title: string
  summary: string
}

type Selection =
  | {type: 'overview'}
  | {type: 'strand'; id: StrandId}
  | {type: 'node'; strandId: StrandId; nodeId: string}

const graphWidth = 1120
const graphHeight = 680

const strands: Strand[] = [
  {
    id: 'epistemology',
    title: '认识论与解释',
    english: 'Epistemology & Explanation',
    color: '#2563eb',
    pale: '#dbeafe',
    textColor: '#1d4ed8',
    center: {x: 255, y: 190},
    chapters: ['引言', '第 1 章', '第 2 章', '第 4 章', '第 9 章', '第 12 章'],
    question: '知识从哪里来？什么样的解释值得保留？',
    claim:
      '知识不是从经验中归纳出来的，而是猜想在批评中被改进后留下来的解释。好解释难以随意改变，坏解释可以适配几乎任何结果。',
    warning:
      '这条线索很重要，但不应该吞掉整本书。它是评价知识质量的标准，不是所有概念的唯一来源。',
    nodes: [
      {
        id: 'knowledge',
        title: '知识',
        english: 'Knowledge',
        notePath: 'Knowledge',
        summary: '能在合适环境中保持自身并产生作用的信息。',
        role: '全书的共同对象：解释、基因、谜米、程序和制度都可以承载知识。',
        angle: -2.55,
      },
      {
        id: 'explanation',
        title: '解释',
        english: 'Explanation',
        notePath: 'Explanation',
        summary: '说明现实中有什么、它做什么，以及为什么如此。',
        role: 'Deutsch 反对只要预测，不要解释的哲学。',
        angle: -1.65,
      },
      {
        id: 'good-explanation',
        title: '好解释',
        english: 'Good Explanation',
        notePath: 'Good Explanation',
        summary: '细节承担约束，不能随便改而保持同样解释力。',
        role: '认识论线索的评价标准。',
        angle: -0.55,
      },
      {
        id: 'hard-to-vary',
        title: '难以改变',
        english: 'Hard to vary',
        notePath: 'Hard to vary',
        summary: '好解释、好适应、好政策都往往难以随意变形。',
        role: '把解释质量与适应性、政策选择连接起来。',
        angle: 0.4,
      },
      {
        id: 'criticism',
        title: '批评',
        english: 'Criticism',
        notePath: 'Criticism',
        summary: '错误通过批评暴露，知识通过纠错增长。',
        role: '让猜想变成知识的筛选机制。',
        angle: 1.42,
      },
      {
        id: 'fallibilism',
        title: '易谬主义',
        english: 'Fallibilism',
        notePath: 'Fallibilism',
        summary: '任何知识都可能错，因此进步依赖持续纠错。',
        role: '防止权威主义和最终真理崇拜。',
        angle: 2.35,
      },
    ],
  },
  {
    id: 'universality',
    title: '通用性与计算',
    english: 'Universality & Computation',
    color: '#0f766e',
    pale: '#ccfbf1',
    textColor: '#0f766e',
    center: {x: 595, y: 150},
    chapters: ['第 6 章', '第 7 章', '第 8 章'],
    question: '为什么有限系统可以突然获得无上限的 reach？',
    claim:
      '文字、数字、计算、解释者和构造器都展示了同一种结构：跨过某个门槛后，有限规则能覆盖无限开放的任务空间。',
    warning:
      '通用性不是效率。罗马数字、巴比伦数字、英文拼写或多米诺骨牌计算机都提醒我们：跨过门槛之后仍有好用性问题。',
    nodes: [
      {
        id: 'universality',
        title: '通用性',
        english: 'Universality',
        notePath: 'Universality',
        summary: '一个系统达到某个门槛后，能力不再局限于原始用途。',
        role: '第 6 章的主轴，也是连接计算、解释者和构造器的桥。',
        angle: -2.65,
      },
      {
        id: 'jump',
        title: '向通用性跳转',
        english: 'Jump to Universality',
        notePath: 'Jump to Universality',
        summary: '渐进改进在某个节点导致能力发生质变。',
        role: '解释为什么某些技术发展看起来不是线性增强。',
        angle: -1.65,
      },
      {
        id: 'computation',
        title: '通用计算',
        english: 'Universal Computation',
        notePath: 'Universal Computation',
        summary: '可编程状态转换可以模拟任何可计算过程。',
        role: '把文字处理、数学证明和物理模拟放在同一个抽象框架里。',
        angle: -0.55,
      },
      {
        id: 'constructor',
        title: '构造器',
        english: 'Constructor',
        notePath: 'Constructor',
        summary: '能反复导致某类物理转化发生而自身保持可用的系统。',
        role: '通用构造器和后来 constructor theory 思想的入口。',
        angle: 0.45,
      },
      {
        id: 'universal-constructor',
        title: '通用构造器',
        english: 'Universal Constructor',
        notePath: 'Universal Constructor',
        summary: '原则上能构造任何物理上可构造对象的构造器。',
        role: '不是好解释的子概念，而是物理可构造性的通用性版本。',
        angle: 1.45,
      },
      {
        id: 'universal-explainers',
        title: '通用解释者',
        english: 'Universal Explainers',
        notePath: 'Universal Explainers',
        summary: '人可以创造任意 reach 的解释。',
        role: '把通用性线索连接到人的创造力和进步。',
        angle: 2.4,
      },
    ],
  },
  {
    id: 'reality',
    title: '实在、抽象与物理',
    english: 'Reality, Abstraction & Physics',
    color: '#7c3aed',
    pale: '#ede9fe',
    textColor: '#6d28d9',
    center: {x: 875, y: 310},
    chapters: ['第 2 章', '第 5 章', '第 8 章', '第 11 章', '第 12 章'],
    question: '现实是什么？抽象对象为什么也能进入物理解释？',
    claim:
      '表象背后有客观现实。抽象实体、突现层次和多重宇宙不是方便说法；当它们进入最佳解释时，它们就是现实的一部分。',
    warning:
      '这里不是在讲目的论。抽象解释说明结构如何约束物理事件，不等于说自然界带有意图。',
    nodes: [
      {
        id: 'reality',
        title: '现实',
        english: 'Reality / Realism',
        notePath: 'Reality',
        summary: '表象背后存在独立于观察者的现实结构。',
        role: '反对经验主义和工具主义只谈经验或预测。',
        angle: -2.65,
      },
      {
        id: 'abstraction',
        title: '抽象的现实',
        english: 'Abstract Reality',
        notePath: 'Abstraction',
        summary: '程序、素数性、因果关系等抽象实体可以是最佳解释的一部分。',
        role: '第 5 章的核心线索。',
        angle: -1.5,
      },
      {
        id: 'emergence',
        title: '突现现象',
        english: 'Emergent phenomena',
        notePath: 'Emergent phenomena',
        summary: '高层解释不只是低层物理描述的简写。',
        role: '反对粗糙还原论。',
        angle: -0.38,
      },
      {
        id: 'multiverse',
        title: '多重宇宙',
        english: 'Multiverse',
        notePath: 'Multiverse',
        summary: '量子理论的现实结构，由信息流和干涉揭示。',
        role: '物理线索中最强的反直觉实在论案例。',
        angle: 0.75,
      },
      {
        id: 'infinity',
        title: '无穷',
        english: 'Infinity',
        notePath: 'Infinity',
        summary: '无穷不是修辞，而是数学和物理解释中的真实结构。',
        role: '支撑无穷旅馆、可判定性、概率和进步起点等主题。',
        angle: 1.8,
      },
      {
        id: 'reductionism',
        title: '还原论',
        english: 'Reductionism',
        notePath: 'Reductionism',
        summary: '把所有真实解释压到最低层物理，会遗漏关键解释。',
        role: '第 5 章的主要反面概念。',
        angle: 2.7,
      },
    ],
  },
  {
    id: 'evolution',
    title: '进化、谜米与创造力',
    english: 'Evolution, Memes & Creativity',
    color: '#0891b2',
    pale: '#cffafe',
    textColor: '#0e7490',
    center: {x: 660, y: 520},
    chapters: ['第 3 章', '第 4 章', '第 15 章', '第 16 章'],
    question: '知识除了在人脑中，还如何被创造、复制和保存？',
    claim:
      '生物进化和人类创造力是已知的两类知识创造过程。基因、谜米和思想都涉及复制、变异、选择与纠错，但它们的载体和限制不同。',
    warning:
      '不要把生物进化直接等同于人的创造力：生物适应性通常没有解释性，人的解释可以有开放 reach。',
    nodes: [
      {
        id: 'evolution',
        title: '进化',
        english: 'Evolution',
        notePath: 'Evolution',
        summary: '通过变异和选择在基因中积累关于环境的知识。',
        role: '知识创造的非人类版本。',
        angle: -2.75,
      },
      {
        id: 'neo-darwinism',
        title: '新达尔文主义',
        english: 'Neo-Darwinism',
        notePath: 'Neo-Darwinism',
        summary: '复制得更好的基因变体会在群体中扩散。',
        role: '生物适应性知识的好解释。',
        angle: -1.8,
      },
      {
        id: 'replicators',
        title: '复制因子',
        english: 'Replicators',
        notePath: 'Replicators',
        summary: '会导致自身复制的信息结构。',
        role: '把基因和谜米放在同一抽象框架。',
        angle: -0.72,
      },
      {
        id: 'memes',
        title: '谜米',
        english: 'Memes',
        notePath: 'Memes',
        summary: '能够通过行为和理解在头脑之间复制的观念。',
        role: '文化进化的基本单位。',
        angle: 0.33,
      },
      {
        id: 'creativity',
        title: '创造力',
        english: 'Creativity',
        notePath: 'Creativity',
        summary: '创造新解释和重建意义的能力。',
        role: '解释复杂谜米如何复制，也解释人为何是通用解释者。',
        angle: 1.42,
      },
      {
        id: 'ai',
        title: '人工智能',
        english: 'AI',
        notePath: 'AI',
        summary: '真正的 AI 需要理解创造力，而不是更像聊天机器人。',
        role: '第 7 章和第 16 章之间的应用问题。',
        angle: 2.47,
      },
    ],
  },
  {
    id: 'society',
    title: '社会、选择与进步',
    english: 'Society, Choice & Progress',
    color: '#dc2626',
    pale: '#fee2e2',
    textColor: '#b91c1c',
    center: {x: 280, y: 500},
    chapters: ['第 3 章', '第 9 章', '第 13 章', '第 15 章', '第 17 章', '第 18 章'],
    question: '什么样的文化和制度让知识增长持续发生？',
    claim:
      '进步不是资源或环境自动给出的结果，而是动态社会、理性谜米、批评传统和快速纠错共同维持的开放过程。',
    warning:
      '乐观主义不是预言好事会自动发生；它要求我们承认问题存在，并通过创造知识解决问题。',
    nodes: [
      {
        id: 'progress',
        title: '进步',
        english: 'Progress',
        notePath: 'Progress',
        summary: '从错误观念向错误更少的观念持续移动。',
        role: '全书最终关心的历史方向。',
        angle: -2.7,
      },
      {
        id: 'dynamic',
        title: '动态社会',
        english: 'Dynamic Societies',
        notePath: 'Dynamic Societies',
        summary: '允许批评、创新和错误修正的社会。',
        role: '知识增长的社会载体。',
        angle: -1.7,
      },
      {
        id: 'static',
        title: '静态社会',
        english: 'Static Societies',
        notePath: 'Static Societies',
        summary: '压制创新以维持传统复制的社会。',
        role: '第 15 章和第 17 章的反面结构。',
        angle: -0.65,
      },
      {
        id: 'optimism',
        title: '乐观主义',
        english: 'Optimism',
        notePath: 'Optimism',
        summary: '恶来自知识不足，具体问题原则上可解决。',
        role: '社会线索的哲学核心。',
        angle: 0.36,
      },
      {
        id: 'choice',
        title: '选择',
        english: 'Choice',
        notePath: 'Choice',
        summary: '好的决策不是固定公式选择，而是创造新选项。',
        role: '把政治、道德和创造性问题连接起来。',
        angle: 1.47,
      },
      {
        id: 'sustainability',
        title: '不可维持',
        english: 'Unsustainable',
        notePath: 'Unsustainable',
        summary: '防守式维持会败给不可预见问题，必须依靠快速进步。',
        role: '第 17 章对静态社会和预防原则的批评。',
        angle: 2.5,
      },
    ],
  },
]

const crossLinks: CrossLink[] = [
  {
    source: 'epistemology',
    target: 'universality',
    title: 'Reach',
    summary: '好解释有延伸范围；通用系统把 reach 做成结构性能力。',
  },
  {
    source: 'universality',
    target: 'reality',
    title: '物理可实现性',
    summary: '通用计算和通用构造都依赖物理规律允许某些抽象结构被实例化。',
  },
  {
    source: 'epistemology',
    target: 'evolution',
    title: '知识创造',
    summary: '猜想与批评、生物变异与选择是两种不同的知识创造过程。',
  },
  {
    source: 'evolution',
    target: 'society',
    title: '谜米与文化',
    summary: '文化由谜米构成；动态社会依赖理性谜米压制反理性谜米。',
  },
  {
    source: 'epistemology',
    target: 'society',
    title: '纠错制度',
    summary: '批评传统在科学中创造知识，在政治和文化中使进步可持续。',
  },
  {
    source: 'universality',
    target: 'evolution',
    title: '人作为通用解释者',
    summary: '人的创造力从复制复杂谜米的能力中进化出来，但获得了通用解释能力。',
  },
  {
    source: 'reality',
    target: 'society',
    title: '反狭隘性',
    summary: '理解现实的尺度和抽象层次，会改变我们对地球、资源和未来的政治想象。',
  },
]

const strandById = new Map(strands.map((strand) => [strand.id, strand]))

const roundCoordinate = (value: number) => Math.round(value * 100) / 100

const radialPosition = (strand: Strand, node: ConceptNode) => {
  const radius = node.radius || 112

  return {
    x: roundCoordinate(strand.center.x + Math.cos(node.angle) * radius),
    y: roundCoordinate(strand.center.y + Math.sin(node.angle) * radius),
  }
}

const curvedPath = (source: Strand, target: Strand) => {
  const midX = (source.center.x + target.center.x) / 2
  const midY = (source.center.y + target.center.y) / 2
  const dx = target.center.x - source.center.x
  const dy = target.center.y - source.center.y
  const distance = Math.sqrt(dx * dx + dy * dy) || 1
  const offset = 38
  const controlX = midX - (dy / distance) * offset
  const controlY = midY + (dx / distance) * offset

  return `M ${source.center.x} ${source.center.y} Q ${roundCoordinate(
    controlX,
  )} ${roundCoordinate(controlY)} ${target.center.x} ${target.center.y}`
}

const nodeKey = (strandId: StrandId, nodeId: string) => `${strandId}:${nodeId}`

const getSelectionKey = (selection: Selection) => {
  if (selection.type === 'overview') return 'overview'
  if (selection.type === 'strand') return selection.id

  return nodeKey(selection.strandId, selection.nodeId)
}

const activationKeys = new Set(['Enter', ' '])

const selectedStrand = (selection: Selection) => {
  if (selection.type === 'overview') return undefined

  return strandById.get(selection.type === 'strand' ? selection.id : selection.strandId)
}

const selectedNode = (selection: Selection) => {
  if (selection.type !== 'node') return undefined
  const strand = strandById.get(selection.strandId)

  return strand?.nodes.find((node) => node.id === selection.nodeId)
}

export const BookStrandsMap: React.FC = () => {
  const [selection, setSelection] = useState<Selection>({type: 'overview'})
  const activeKey = getSelectionKey(selection)
  const activeStrand = selectedStrand(selection)
  const activeNode = selectedNode(selection)

  const chapterMap = useMemo(
    () => [
      ['1-2', '解释、现实、仪器和理论负载观察', 'epistemology'],
      ['4', '生物进化与人类知识创造的对应关系', 'evolution'],
      ['5', '抽象实体和突现解释的现实性', 'reality'],
      ['6-8', '通用性、计算、无穷和可判定性', 'universality'],
      ['9, 13, 17', '乐观主义、选择和不可维持', 'society'],
      ['15-16', '谜米、静态社会与创造力进化', 'evolution'],
      ['18', '拒绝终点论，重新开始无限进步', 'society'],
    ],
    [],
  )

  return (
    <main className="h-full overflow-y-auto bg-slate-50">
      <section className="border-b border-slate-200 bg-white px-5 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-blue-600">
            多中心阅读图谱
          </p>
          <h1 className="mt-2 max-w-4xl text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            《无穷的开始》不是一条主线，而是几条互相支撑的解释网络
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
            现有知识网络适合看局部链接；这个页面按原书问题结构重组，把核心概念分成五条线索。
            好解释仍然重要，但它只是认识论线索的中心，不应该替代通用性、抽象实在、进化创造力和社会进步这些独立主线。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                线索与跨线索连接
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                点击一个中心或概念，右侧会显示它在整本书中的角色。
              </p>
            </div>
            <button
              type="button"
              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              onClick={() => setSelection({type: 'overview'})}
            >
              回到总览
            </button>
          </div>

          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              className="block w-full min-w-[840px] lg:min-w-0"
              role="img"
              aria-label="《无穷的开始》多中心线索图谱"
            >
              <rect width={graphWidth} height={graphHeight} fill="#f8fafc" />
              <g opacity={selection.type === 'overview' ? 1 : 0.42}>
                {crossLinks.map((link) => {
                  const source = strandById.get(link.source)
                  const target = strandById.get(link.target)
                  if (!source || !target) return null

                  return (
                    <path
                      key={`${link.source}-${link.target}`}
                      d={curvedPath(source, target)}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth={1.6}
                      strokeDasharray="6 7"
                    />
                  )
                })}
              </g>

              {strands.map((strand) => {
                const selected = activeKey === strand.id
                const related =
                  selection.type === 'node' && selection.strandId === strand.id
                const dimmed =
                  selection.type !== 'overview' && !selected && !related

                return (
                  <g key={strand.id} opacity={dimmed ? 0.36 : 1}>
                    {strand.nodes.map((node) => {
                      const position = radialPosition(strand, node)
                      const key = nodeKey(strand.id, node.id)
                      const active = activeKey === key

                      return (
                        <g key={node.id}>
                          <line
                            x1={strand.center.x}
                            y1={strand.center.y}
                            x2={position.x}
                            y2={position.y}
                            stroke={active || selected ? strand.color : '#cbd5e1'}
                            strokeWidth={active ? 2.2 : 1.2}
                          />
                          <g
                            role="button"
                            tabIndex={0}
                            aria-label={node.title}
                            onClick={() =>
                              setSelection({
                                type: 'node',
                                strandId: strand.id,
                                nodeId: node.id,
                              })
                            }
                            onKeyDown={(event) => {
                              if (!activationKeys.has(event.key)) return
                              event.preventDefault()
                              setSelection({
                                type: 'node',
                                strandId: strand.id,
                                nodeId: node.id,
                              })
                            }}
                            className="cursor-pointer outline-none"
                          >
                            <rect
                              x={position.x - 58}
                              y={position.y - 17}
                              width={116}
                              height={34}
                              rx={7}
                              fill={active ? strand.color : '#ffffff'}
                              stroke={active ? strand.color : '#cbd5e1'}
                              strokeWidth={active ? 2 : 1.2}
                            />
                            <text
                              x={position.x}
                              y={position.y + 4}
                              textAnchor="middle"
                              fontSize={11}
                              fontWeight={active ? 700 : 600}
                              fill={active ? '#ffffff' : '#334155'}
                            >
                              {node.title.length > 7
                                ? `${node.title.slice(0, 7)}…`
                                : node.title}
                            </text>
                            <title>{`${node.title} (${node.english})`}</title>
                          </g>
                        </g>
                      )
                    })}

                    <g
                      role="button"
                      tabIndex={0}
                      aria-label={strand.title}
                      onClick={() => setSelection({type: 'strand', id: strand.id})}
                      onKeyDown={(event) => {
                        if (!activationKeys.has(event.key)) return
                        event.preventDefault()
                        setSelection({type: 'strand', id: strand.id})
                      }}
                      className="cursor-pointer outline-none"
                    >
                      <circle
                        cx={strand.center.x}
                        cy={strand.center.y}
                        r={selected || related ? 58 : 50}
                        fill={selected || related ? strand.color : strand.pale}
                        stroke={strand.color}
                        strokeWidth={selected || related ? 3 : 2}
                      />
                      <text
                        x={strand.center.x}
                        y={strand.center.y - 5}
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight={800}
                        fill={selected || related ? '#ffffff' : strand.textColor}
                      >
                        {strand.title}
                      </text>
                      <text
                        x={strand.center.x}
                        y={strand.center.y + 16}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={600}
                        fill={selected || related ? '#e0f2fe' : '#64748b'}
                      >
                        {strand.english}
                      </text>
                    </g>
                  </g>
                )
              })}

              <g>
                {crossLinks.map((link, index) => {
                  const source = strandById.get(link.source)
                  const target = strandById.get(link.target)
                  if (!source || !target) return null
                  const x = (source.center.x + target.center.x) / 2
                  const y = (source.center.y + target.center.y) / 2

                  return (
                    <g key={link.title}>
                      <rect
                        x={x - 48}
                        y={y - 13 + (index % 2 === 0 ? -10 : 10)}
                        width={96}
                        height={26}
                        rx={6}
                        fill="#ffffff"
                        stroke="#e2e8f0"
                      />
                      <text
                        x={x}
                        y={y + 4 + (index % 2 === 0 ? -10 : 10)}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={700}
                        fill="#64748b"
                      >
                        {link.title}
                      </text>
                    </g>
                  )
                })}
              </g>
            </svg>
          </div>
        </div>

        <aside className="rounded-md border border-slate-200 bg-white p-5">
          {selection.type === 'overview' && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                总览
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                不要把所有概念都压成“好解释”
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                更忠实的读法是：全书围绕知识和进步展开，但通过几条不同线索推进。
                好解释（Good Explanation）解释知识质量；通用性（Universality）解释有限系统为何有无限 reach；
                抽象的现实（Abstract Reality）和多重宇宙（Multiverse）说明现实结构；进化和谜米说明知识如何复制；动态社会说明进步如何持续。
              </p>
              <div className="mt-5 space-y-2">
                {strands.map((strand) => (
                  <button
                    key={strand.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                    onClick={() => setSelection({type: 'strand', id: strand.id})}
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {strand.title}
                    </span>
                    <span className="text-xs text-slate-400">
                      {strand.nodes.length} 个节点
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeStrand && selection.type === 'strand' && (
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{color: activeStrand.textColor}}
              >
                {activeStrand.english}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                {activeStrand.title}
              </h2>
              <p className="mt-3 text-sm font-medium text-slate-800">
                {activeStrand.question}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {activeStrand.claim}
              </p>
              <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                {activeStrand.warning}
              </p>
              <div className="mt-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  对应章节
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeStrand.chapters.map((chapter) => (
                    <span
                      key={chapter}
                      className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                    >
                      {chapter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeStrand && activeNode && (
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{color: activeStrand.textColor}}
              >
                {activeStrand.title}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                {activeNode.title}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{activeNode.english}</p>
              <p className="mt-4 text-sm leading-7 text-slate-700">
                {activeNode.summary}
              </p>
              <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                {activeNode.role}
              </p>
              {activeNode.notePath && (
                <Link href={`/${encodeURIComponent(activeNode.notePath)}`}>
                  <a className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                    打开对应笔记
                  </a>
                </Link>
              )}
            </div>
          )}
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="rounded-md border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-950">
              按线索重读原书
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              这个顺序不是章节替代品，而是帮助你把每章放回它服务的主问题。
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {chapterMap.map(([chapter, summary, strandId]) => {
              const strand = strandById.get(strandId as StrandId)

              return (
                <button
                  key={`${chapter}-${summary}`}
                  type="button"
                  className="grid w-full gap-3 px-5 py-4 text-left hover:bg-slate-50 md:grid-cols-[120px_minmax(0,1fr)_220px]"
                  onClick={() =>
                    strand && setSelection({type: 'strand', id: strand.id})
                  }
                >
                  <span className="text-sm font-semibold text-slate-900">
                    第 {chapter} 章
                  </span>
                  <span className="text-sm leading-6 text-slate-600">
                    {summary}
                  </span>
                  <span
                    className={clsx(
                      'text-sm font-medium',
                      strand ? '' : 'text-slate-400',
                    )}
                    style={{color: strand?.textColor}}
                  >
                    {strand?.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
