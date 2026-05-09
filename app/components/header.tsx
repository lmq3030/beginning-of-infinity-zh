import Link from 'next/link'
import React from 'react'

export const Header: React.FC = () => (
  <div className="flex-none h-[60px] space-x-5 flex items-center justify-between border-b select-none md:px-8 px-5">
    <h1 className="md:text-xl text-sm font-medium">
      <Link href="/">
        <a>无穷的开始</a>
      </Link>
    </h1>

    <h3 className="md:text-base text-sm font-normal">
      <Link href="/About">
        <a>关于这些笔记</a>
      </Link>
    </h3>
  </div>
)
