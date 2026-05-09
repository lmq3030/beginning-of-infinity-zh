import React, {MouseEvent} from 'react'
import clsx from 'clsx'
import {NotePreview} from './note-preview'

interface Props {
  path: string
  label?: string
  active?: boolean
  onClick?: (event: MouseEvent) => void
  onMouseEnter?: (event: MouseEvent) => void
  onMouseLeave?: (event: MouseEvent) => void
}

export const NoteBacklink: React.FC<Props> = ({
  path,
  label,
  active = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const onLinkClick = (event: MouseEvent) => {
    event.stopPropagation()
    onClick?.(event)
  }

  return (
    <NotePreview path={path}>
      <a
        className={clsx(
          'text-blue-500 transition-colors',
          active &&
            'rounded-sm bg-blue-100 px-1 py-0.5 font-semibold text-blue-700 ring-1 ring-blue-300',
        )}
        href={path}
        onClick={onLinkClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label || path}
      </a>
    </NotePreview>
  )
}
