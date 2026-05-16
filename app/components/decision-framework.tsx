import clsx from 'clsx'
import React, {useMemo, useState} from 'react'

type ConceptId =
  | 'hard-to-vary'
  | 'rival-explanations'
  | 'error-correction'
  | 'fallibilism'
  | 'reach'
  | 'choice-creation'
  | 'dynamic-environment'
  | 'parochialism'
  | 'universality'
  | 'knowledge-bottleneck'
  | 'optimism'

interface Concept {
  id: ConceptId
  title: string
  english: string
  group: 'diagnosis' | 'correction' | 'action'
  x: number
  y: number
  summary: string
  question: string
  moves: string[]
  trap: string
  example: string
}

interface Connection {
  source: ConceptId
  target: ConceptId
  label: string
}

interface Scenario {
  title: string
  situation: string
  concepts: ConceptId[]
  weakMove: string
  strongerMove: string[]
  decisionRule: string
}

const graphWidth = 1000
const graphHeight = 620
const nodeWidth = 154
const nodeHeight = 56

const groupStyles = {
  diagnosis: {
    label: '判断解释',
    color: '#2563eb',
    pale: '#dbeafe',
    text: '#1d4ed8',
  },
  correction: {
    label: '降低错误成本',
    color: '#0f766e',
    pale: '#ccfbf1',
    text: '#0f766e',
  },
  action: {
    label: '创造行动空间',
    color: '#dc2626',
    pale: '#fee2e2',
    text: '#b91c1c',
  },
} as const

const concepts: Concept[] = [
  {
    id: 'hard-to-vary',
    title: '难以改变',
    english: 'Hard to vary',
    group: 'diagnosis',
    x: 167,
    y: 140,
    summary: '一个解释的细节必须承担约束；如果随便替换原因仍然说得通，它就还不够好。',
    question: '这个解释里哪一处细节如果改掉，结论就会明显变弱？',
    moves: [
      '把解释压缩成机制链：A 通过 B 导致 C。',
      '替换其中一个变量，观察解释是否仍然同样顺滑。',
      '要求解释给出它不能解释的边界。',
    ],
    trap: '把“听起来合理”误当成“解释力强”。',
    example:
      '“用户懒”很容易变；“用户没有即时反馈循环，所以学习行为无法维持”更难随便改。',
  },
  {
    id: 'rival-explanations',
    title: '竞争解释',
    english: 'Rival explanations',
    group: 'diagnosis',
    x: 167,
    y: 250,
    summary: '不要只问某个解释是否合理；要问它是否胜过最强替代解释。',
    question: '如果这个解释错了，最强的替代解释是什么？',
    moves: [
      '至少写出两个 rival explanations。',
      '比较每个解释能排除什么结果。',
      '优先保留能解释尴尬案例的解释。',
    ],
    trap: '只和稻草人竞争，导致第一个顺耳故事获胜。',
    example:
      '增长可能来自产品价值、渠道红利、价格补贴、季节性、统计口径变化；先别急着庆祝 PMF。',
  },
  {
    id: 'reach',
    title: '延伸范围',
    english: 'Reach',
    group: 'diagnosis',
    x: 167,
    y: 360,
    summary: '好的判断通常不只解释一个孤立事件，还能迁移到相邻情境。',
    question: '这个判断能不能指导下一次相似决策？',
    moves: [
      '检查它能否解释三个相邻案例。',
      '区分真正迁移和事后类比。',
      '找出它不该延伸到哪里。',
    ],
    trap: '把一个局部经验扩写成万能原则。',
    example:
      '“这个候选人不行”reach 很低；“我们筛选的是表达力，不是独立推进能力”能改进整套招聘流程。',
  },
  {
    id: 'parochialism',
    title: '反狭隘性',
    english: 'Anti-parochialism',
    group: 'diagnosis',
    x: 167,
    y: 470,
    summary: '很多判断不是逻辑错，而是把局部样本误当成现实本身。',
    question: '我看到的是现实结构，还是某个圈层、平台、行业、阶段的局部现象？',
    moves: [
      '主动换样本：强者、弱者、沉默者、失败者都看。',
      '问这个规律在另一个国家、行业、年龄层是否仍成立。',
      '警惕幸存者偏差和熟人样本。',
    ],
    trap: '用自己所在信息流里的常识替代现实。',
    example:
      '“大家都在用这个工具”可能只是你所在社区的局部热度，不等于主流市场已采用。',
  },
  {
    id: 'fallibilism',
    title: '易谬主义',
    english: 'Fallibilism',
    group: 'correction',
    x: 500,
    y: 170,
    summary: '任何判断都可能错，所以重要判断必须自带改变条件。',
    question: '什么事实出现时，我会改变现在的判断？',
    moves: [
      '写下当前判断、信心程度和改变条件。',
      '把观点和自尊分开。',
      '定期复盘自己为什么被坏解释说服。',
    ],
    trap: '把“我可能错”说成口号，却没有任何会改变判断的条件。',
    example:
      '决定加入团队前，先写：如果一个月内发现反馈被惩罚、信息不透明、承诺频繁变化，就重新评估。',
  },
  {
    id: 'error-correction',
    title: '纠错路径',
    english: 'Error correction',
    group: 'correction',
    x: 500,
    y: 310,
    summary: '好决策不保证第一次正确，而是错误能更快暴露、更便宜修正。',
    question: '如果我错了，多久能知道？知道后还能不能改？',
    moves: [
      '先做小实验，不先做不可逆承诺。',
      '缩短反馈周期。',
      '为退出、回滚、复盘留结构。',
    ],
    trap: '只比较 upside，不比较发现错误和修正错误的成本。',
    example:
      '与其直接转型，不如先用 6 周做一个真实项目，观察能量、能力缺口和市场反馈。',
  },
  {
    id: 'dynamic-environment',
    title: '动态环境',
    english: 'Dynamic environment',
    group: 'correction',
    x: 500,
    y: 450,
    summary: '一个环境的质量取决于坏想法能否被指出、错误能否被修正。',
    question: '这里说真话、指出错误、改变旧做法的成本高不高？',
    moves: [
      '观察反对意见如何被处理。',
      '看失败是否会产生学习，而不是只产生责备。',
      '优先选择能吸收批评的团队和关系。',
    ],
    trap: '把表面和谐误认为系统健康。',
    example:
      '一个团队不怕争论但能改流程，通常比一个永远“氛围很好”但没人指出问题的团队更安全。',
  },
  {
    id: 'choice-creation',
    title: '创造选项',
    english: 'Choice creation',
    group: 'action',
    x: 833,
    y: 140,
    summary: '很多好决策不是在 A/B 里选，而是创造一个更好的 C。',
    question: '我是不是被题目给出的选项绑架了？',
    moves: [
      '把二选一改写成约束条件：我真正想保留什么、避免什么？',
      '设计一个低成本试验选项。',
      '把时间、范围、角色、合作方式拆开重组。',
    ],
    trap: '把当前可见选项当成完整选项空间。',
    example:
      '不是“留下还是离职”，而是“能否调职责、换团队、做三个月试验、同时建立外部期权”。',
  },
  {
    id: 'knowledge-bottleneck',
    title: '知识瓶颈',
    english: 'Knowledge bottleneck',
    group: 'action',
    x: 833,
    y: 250,
    summary: '许多问题表面是资源不足，本质是缺少某类知识。',
    question: '如果这个问题原则上可解，我现在缺的到底是哪种知识？',
    moves: [
      '区分机制知识、执行知识、市场知识、人的知识和自我知识。',
      '把抱怨资源改成寻找缺失知识。',
      '直接设计能获取该知识的行动。',
    ],
    trap: '把“不知道怎么做”误读成“没办法”。',
    example:
      '“我没时间学习”可能不是时间问题，而是不知道如何把学习嵌入真实任务和反馈循环。',
  },
  {
    id: 'universality',
    title: '能力门槛',
    english: 'Universality threshold',
    group: 'action',
    x: 833,
    y: 360,
    summary: '有些能力不是线性增强，而是跨过门槛后打开整类新行动空间。',
    question: '这个投入只是让我快一点，还是会解锁一整类新能力？',
    moves: [
      '寻找能复用到多个问题的技能和工具。',
      '把局部技巧升级成可编程、可组合、可迁移的系统。',
      '警惕只优化效率、不改变能力边界的投入。',
    ],
    trap: '把微小效率提升误认为战略能力。',
    example:
      '会用 AI 聊天是效率提升；会用 AI 建自动化工作流可能跨过新的能力门槛。',
  },
  {
    id: 'optimism',
    title: '理性乐观',
    english: 'Optimism',
    group: 'action',
    x: 833,
    y: 470,
    summary: '问题可解，但不会自动解决；每个具体恶都对应某种缺失知识。',
    question: '如果这件事可解，下一块需要创造或获得的知识是什么？',
    moves: [
      '避免“会自然变好”和“永远没办法”两个极端。',
      '把情绪判断改写成具体问题。',
      '寻找最小可学习步骤。',
    ],
    trap: '把乐观主义误解成安慰剂。',
    example:
      '“这个市场太难了”不如改成“我们缺的是分发知识、定价知识，还是用户任务知识？”',
  },
]

const connections: Connection[] = [
  {source: 'hard-to-vary', target: 'rival-explanations', label: '筛掉顺耳故事'},
  {source: 'rival-explanations', target: 'reach', label: '比较解释力'},
  {source: 'reach', target: 'parochialism', label: '防止过度外推'},
  {source: 'fallibilism', target: 'error-correction', label: '承认错误→降低错误'},
  {source: 'error-correction', target: 'dynamic-environment', label: '把纠错制度化'},
  {source: 'choice-creation', target: 'knowledge-bottleneck', label: '找缺失知识'},
  {source: 'knowledge-bottleneck', target: 'optimism', label: '具体问题可解'},
  {source: 'knowledge-bottleneck', target: 'universality', label: '投资通用能力'},
  {source: 'universality', target: 'reach', label: '能力带来迁移'},
  {source: 'dynamic-environment', target: 'choice-creation', label: '环境决定选项空间'},
  {source: 'hard-to-vary', target: 'knowledge-bottleneck', label: '机制约束暴露缺口'},
]

const scenarios: Scenario[] = [
  {
    title: '要不要加入一个团队',
    situation: '团队很聪明，机会看起来大，但你不确定它是否健康。',
    concepts: ['dynamic-environment', 'error-correction', 'fallibilism', 'parochialism'],
    weakMove: '只看创始人表达、融资、title 和朋友评价。',
    strongerMove: [
      '观察反对意见是否会进入决策，而不是被当作态度问题。',
      '问最近一次重大错误如何被发现、复盘和修正。',
      '设定 30 天改变条件：信息透明度、承诺稳定性、反馈是否被惩罚。',
    ],
    decisionRule:
      '如果环境能快速暴露错误，短期混乱可以接受；如果错误被包装成忠诚问题，长期风险很高。',
  },
  {
    title: '判断一个产品为什么增长',
    situation: '某个产品数据突然变好，团队倾向于解释为产品价值被验证。',
    concepts: ['hard-to-vary', 'rival-explanations', 'reach', 'parochialism'],
    weakMove: '直接说“用户喜欢我们”，然后扩大投入。',
    strongerMove: [
      '列出替代解释：渠道红利、补贴、季节性、统计口径、竞品事故。',
      '找这个解释不能解释的 cohort 或市场。',
      '看增长机制能否迁移到另一个渠道或相邻人群。',
    ],
    decisionRule:
      '只有当解释能排除强 rival，并能指导下一次可重复增长，才把它当作产品知识。',
  },
  {
    title: '职业选择：留下还是离开',
    situation: '你觉得当前工作消耗大，但离开也有不确定性。',
    concepts: ['choice-creation', 'knowledge-bottleneck', 'error-correction', 'optimism'],
    weakMove: '把问题压成“忍着”或“裸辞”。',
    strongerMove: [
      '先定义真正约束：成长、收入、健康、自由度、长期能力。',
      '创造中间选项：换职责、换团队、做外部项目、设置试验期。',
      '找知识瓶颈：你缺行业信息、技能信心，还是对自己能量模式的理解？',
    ],
    decisionRule:
      '优先选择能在 4-8 周内增加真实信息、同时保留可逆性的行动。',
  },
  {
    title: '是否投入一个新技能',
    situation: '你在考虑学 AI 自动化、编程、英文阅读或写作系统。',
    concepts: ['universality', 'reach', 'knowledge-bottleneck', 'fallibilism'],
    weakMove: '只问这个技能当下是否热门。',
    strongerMove: [
      '判断它是否跨过能力门槛：能不能解锁一整类任务？',
      '看它是否能迁移到工作、学习、表达和创造系统。',
      '用小项目检验：两周内能不能产出真实结果？',
    ],
    decisionRule:
      '优先投资能反复复用、能组合进个人系统、且反馈周期短的通用能力。',
  },
]

const conceptById = new Map(concepts.map((concept) => [concept.id, concept]))

const groupOrder: Concept['group'][] = ['diagnosis', 'correction', 'action']

const selectedConceptFromId = (id: ConceptId) => {
  return conceptById.get(id) || concepts[0]
}

const connectionPath = (source: Concept, target: Concept) => {
  if (Math.abs(source.x - target.x) < 40) {
    const direction = target.y > source.y ? 1 : -1
    const sideX = source.x + (source.group === 'action' ? 92 : -92)
    const startY = source.y + (nodeHeight / 2) * direction
    const endY = target.y - (nodeHeight / 2) * direction

    return `M ${source.x} ${startY} C ${sideX} ${startY} ${sideX} ${endY} ${target.x} ${endY}`
  }

  const sourceToTarget = target.x > source.x ? 1 : -1
  const startX = source.x + (nodeWidth / 2) * sourceToTarget
  const endX = target.x - (nodeWidth / 2) * sourceToTarget
  const midX = (startX + endX) / 2

  return `M ${startX} ${source.y} C ${midX} ${source.y} ${midX} ${target.y} ${endX} ${target.y}`
}

const relatedConceptIds = (id: ConceptId) => {
  const related = new Set<ConceptId>([id])
  for (const connection of connections) {
    if (connection.source === id) related.add(connection.target)
    if (connection.target === id) related.add(connection.source)
  }

  return related
}

export const DecisionFramework: React.FC = () => {
  const [selectedId, setSelectedId] = useState<ConceptId>('hard-to-vary')
  const selectedConcept = selectedConceptFromId(selectedId)
  const relatedIds = useMemo(() => relatedConceptIds(selectedId), [selectedId])
  const selectedConnections = useMemo(
    () => connections.filter(
      (connection) => connection.source === selectedId || connection.target === selectedId,
    ),
    [selectedId],
  )
  const selectedStyle = groupStyles[selectedConcept.group]

  return (
    <main className="h-full overflow-y-auto bg-slate-50">
      <section className="border-b border-slate-200 bg-white px-5 py-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-blue-600">日常决策参考</p>
          <h1 className="mt-2 max-w-4xl text-2xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            把《无穷的开始》里的判断工具变成日常决策框架
          </h1>
          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">
            好解释（Good Explanation）和难以改变（Hard to vary）是起点；真正可用的判断系统还需要竞争解释、纠错路径、反狭隘性、创造选项、知识瓶颈和通用能力门槛。
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-5 md:px-8 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">
              概念网络
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              诊断解释、降低错误成本、创造行动空间，是同一套判断流程的三个阶段。
            </p>
          </div>
          <div className="overflow-x-auto">
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              className="block w-full min-w-[720px] lg:min-w-0"
              role="img"
              aria-label="日常决策框架概念网络"
            >
              <rect width={graphWidth} height={graphHeight} fill="#f8fafc" />
              {groupOrder.map((group, index) => {
                const style = groupStyles[group]
                const x = 34 + index * 333

                return (
                  <g key={group}>
                    <rect
                      x={x}
                      y={54}
                      width={266}
                      height={502}
                      rx={16}
                      fill={style.pale}
                      opacity={0.34}
                      stroke={style.color}
                      strokeDasharray="8 7"
                    />
                    <text
                      x={x + 20}
                      y={86}
                      fontSize={13}
                      fontWeight={800}
                      fill={style.text}
                    >
                      {style.label}
                    </text>
                  </g>
                )
              })}

              <g>
                {connections.map((connection) => {
                  const source = conceptById.get(connection.source)
                  const target = conceptById.get(connection.target)
                  if (!source || !target) return null

                  const active =
                    connection.source === selectedId || connection.target === selectedId

                  return (
                    <path
                      key={`${connection.source}-${connection.target}`}
                      d={connectionPath(source, target)}
                      fill="none"
                      stroke={active ? selectedStyle.color : '#cbd5e1'}
                      strokeWidth={active ? 2.2 : 1.2}
                      strokeDasharray={active ? undefined : '5 6'}
                    />
                  )
                })}
              </g>

              <g>
                {concepts.map((concept) => {
                  const style = groupStyles[concept.group]
                  const active = concept.id === selectedId
                  const related = relatedIds.has(concept.id)
                  const dimmed = !related

                  return (
                    <g
                      key={concept.id}
                      role="button"
                      tabIndex={0}
                      aria-label={concept.title}
                      onClick={() => setSelectedId(concept.id)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return
                        event.preventDefault()
                        setSelectedId(concept.id)
                      }}
                      className="cursor-pointer outline-none"
                      opacity={dimmed ? 0.38 : 1}
                    >
                      <rect
                        x={concept.x - nodeWidth / 2}
                        y={concept.y - nodeHeight / 2}
                        width={nodeWidth}
                        height={nodeHeight}
                        rx={10}
                        fill={active ? style.color : '#ffffff'}
                        stroke={active ? style.color : related ? style.color : '#cbd5e1'}
                        strokeWidth={active ? 2.4 : 1.4}
                      />
                      <text
                        x={concept.x}
                        y={concept.y - 3}
                        textAnchor="middle"
                        fontSize={13}
                        fontWeight={800}
                        fill={active ? '#ffffff' : '#1f2937'}
                      >
                        {concept.title}
                      </text>
                      <text
                        x={concept.x}
                        y={concept.y + 15}
                        textAnchor="middle"
                        fontSize={8.5}
                        fontWeight={600}
                        fill={active ? '#e0f2fe' : '#64748b'}
                      >
                        {concept.english}
                      </text>
                      <title>{`${concept.title} (${concept.english})`}</title>
                    </g>
                  )
                })}
              </g>
            </svg>
          </div>
        </div>

        <aside className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{color: selectedStyle.text}}>
            {groupStyles[selectedConcept.group].label}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {selectedConcept.title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{selectedConcept.english}</p>
          <p className="mt-4 text-sm leading-7 text-slate-700">
            {selectedConcept.summary}
          </p>
          <div className="mt-4 rounded-md bg-slate-50 px-3 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              决策问题
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-800">
              {selectedConcept.question}
            </p>
          </div>
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              可执行动作
            </h3>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              {selectedConcept.moves.map((move) => (
                <li key={move} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full" style={{backgroundColor: selectedStyle.color}} />
                  <span>{move}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 rounded-md border border-rose-100 bg-rose-50 px-3 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-600">
              常见误用
            </h3>
            <p className="mt-2 text-sm leading-6 text-rose-900">
              {selectedConcept.trap}
            </p>
          </div>
          <div className="mt-4 rounded-md border border-slate-200 px-3 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              小例子
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {selectedConcept.example}
            </p>
          </div>
          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 px-3 py-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              相关连接
            </h3>
            <div className="mt-2 space-y-2">
              {selectedConnections.map((connection) => {
                const otherId = connection.source === selectedId ? connection.target : connection.source
                const otherConcept = selectedConceptFromId(otherId)
                const otherStyle = groupStyles[otherConcept.group]

                return (
                  <button
                    key={`${connection.source}-${connection.target}`}
                    type="button"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left transition hover:border-slate-300 hover:bg-slate-100"
                    onClick={() => setSelectedId(otherId)}
                  >
                    <span className="block text-sm font-semibold text-slate-800">
                      {connection.label}
                    </span>
                    <span className="mt-1 inline-flex items-center gap-2 text-xs font-medium" style={{color: otherStyle.text}}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{backgroundColor: otherStyle.color}} />
                      {otherConcept.title} ({otherConcept.english})
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
        <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-950">
              一分钟检查清单
            </h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <p><strong>解释：</strong>它是否难以改变？它击败了哪个竞争解释？</p>
              <p><strong>样本：</strong>我是否把局部经验当成普遍现实？</p>
              <p><strong>纠错：</strong>如果错了，多久能知道？修正成本多高？</p>
              <p><strong>选项：</strong>我是在 A/B 里选，还是能创造更好的 C？</p>
              <p><strong>知识：</strong>这件事真正缺的是哪一类知识？</p>
              <p><strong>门槛：</strong>这个行动是否会解锁一类新能力？</p>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-950">
                案例演练
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                同一个框架可以用于团队、产品、职业和学习决策。
              </p>
            </div>
            <div className="grid divide-y divide-slate-100 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
              {scenarios.map((scenario) => (
                <article key={scenario.title} className="p-5">
                  <h3 className="text-base font-semibold text-slate-950">
                    {scenario.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {scenario.situation}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scenario.concepts.map((id) => {
                      const concept = selectedConceptFromId(id)
                      const style = groupStyles[concept.group]

                      return (
                        <button
                          key={id}
                          type="button"
                          className="rounded-md px-2 py-1 text-xs font-semibold"
                          style={{backgroundColor: style.pale, color: style.text}}
                          onClick={() => setSelectedId(id)}
                        >
                          {concept.title}
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-4 rounded-md bg-slate-50 px-3 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      弱判断
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {scenario.weakMove}
                    </p>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      更强做法
                    </p>
                    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                      {scenario.strongerMove.map((move) => (
                        <li key={move} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-slate-400" />
                          <span>{move}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p
                    className={clsx(
                      'mt-4 rounded-md border px-3 py-3 text-sm font-medium leading-6',
                      'border-emerald-100 bg-emerald-50 text-emerald-950',
                    )}
                  >
                    {scenario.decisionRule}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
