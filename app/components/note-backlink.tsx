import React, {MouseEvent} from 'react'
import {NotePreview} from './note-preview'

interface Props {
  path: string
  label?: string
  onClick?: (event: MouseEvent) => void
  onMouseEnter?: (event: MouseEvent) => void
  onMouseLeave?: (event: MouseEvent) => void
}

export const NoteBacklink: React.FC<Props> = ({
  path,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <NotePreview path={path}>
      <a
        className="text-blue-500"
        href={path}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label || path}
      </a>
    </NotePreview>
  )
}
