import {Note} from 'app/interfaces/note'
import React from 'react'
import {NoteMarkdown} from './note-markdown'
import clsx from 'clsx'

interface Props {
  note: Note
  onClickBacklink?: (
    event: React.MouseEvent,
    path: string,
    backlinkKey?: string,
  ) => void
  activeBacklinkPath?: string
  activeBacklinkKey?: string
}

export const NoteLinks: React.FC<Props> = ({
  note,
  onClickBacklink,
  activeBacklinkPath,
  activeBacklinkKey,
}) => {
  if (!note.linkedFromNotes?.length) return null

  return (
    <div className="bg-gray-100 rounded-md px-6 py-5">
      <h3 className="text-gray-600 text-lg font-medium">链接到这条笔记</h3>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-3">
        {note.linkedFromNotes.map((note) => {
          const backlinkKey = `linked-from-card:${note.path}`

          return (
            <div
              key={note.path}
              onClick={(event) => onClickBacklink?.(event, note.path, backlinkKey)}
              data-note-action="open-linked-note"
              className={clsx(
                'text-gray-600 cursor-pointer block space-y-2 rounded-md p-2 -m-2 transition-colors',
                activeBacklinkKey
                  ? activeBacklinkKey === backlinkKey &&
                      'bg-blue-100 text-blue-900 ring-1 ring-blue-300'
                  : activeBacklinkPath === note.path &&
                      'bg-blue-100 text-blue-900 ring-1 ring-blue-300',
              )}
            >
              <h3 className="text-sm font-medium">{note.title}</h3>

              <NoteMarkdown
                onClickBacklink={onClickBacklink}
                activeBacklinkPath={activeBacklinkPath}
                activeBacklinkKey={activeBacklinkKey}
                linkKeyPrefix={`linked-from-snippet:${note.path}`}
                markdown={note.snippet}
                size="sm"
                style={{
                  display: 'box',
                  lineClamp: 3,
                  boxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
