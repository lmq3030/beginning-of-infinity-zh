import React from 'react'
import {KnowledgeGraph} from './knowledge-graph'

export const Layout: React.FC = ({children}) => (
  <div className="absolute inset-0 overflow-hidden flex flex-col">
    {children}
    <KnowledgeGraph />
  </div>
)
