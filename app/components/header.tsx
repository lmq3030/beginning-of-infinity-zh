import Link from 'next/link'
import React from 'react'

export const Header: React.FC = () => (
  <div className="flex-none h-[60px] space-x-5 flex items-center justify-between border-b select-none md:px-8 px-5">
    <h1 className="md:text-xl text-sm font-medium">
      <Link href="/">
        <a>无穷的开始</a>
      </Link>
    </h1>

    <nav className="flex items-center gap-4 md:text-base text-sm font-normal">
      <Link href="/decision-framework">
        <a>决策框架</a>
      </Link>
      <Link href="/strands">
        <a>线索图谱</a>
      </Link>
      <Link href="/About">
        <a>关于这些笔记</a>
      </Link>
    </nav>
  </div>
)
