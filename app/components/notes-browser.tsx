import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Note} from 'app/interfaces/note'
import {
  NoteBrowserItemWidthWithoutCollapsed,
  NotesBrowserItem,
} from './notes-browser-item'
import {getNote} from 'app/client/notes-cache'
interface Props {
  initialNotes?: Note[]
}

export const NotesBrowser: React.FC<Props> = ({initialNotes = []}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [scrollLeft, setScrollLeft] = useState(0)

  const [viewNotes, setViewNotes] = useState<Note[]>(initialNotes)
  const canGoBack = viewNotes.length > 1

  const setStackedQuery = useCallback((notePaths: string[]) => {
    const [firstPath, ...stackedPaths] = notePaths

    const newUrl = new URL(location.origin + `/${firstPath}`)

    for (const stackedPath of stackedPaths) {
      newUrl.searchParams.append('stacked', stackedPath)
    }

    history.replaceState({}, '', newUrl)
  }, [])

  const goBack = useCallback(() => {
    setViewNotes((notes) => {
      if (notes.length <= 1) return notes

      const previousNotes = notes.slice(0, -1)
      setStackedQuery(previousNotes.map((note) => note.path))

      return previousNotes
    })
  }, [setStackedQuery])

  const onClickBacklink = async (
    event: React.MouseEvent,
    path: string,
    index: number,
  ) => {
    event.preventDefault()

    const appendNote = await getNote(path)

    // Note doesn't exist
    if (!appendNote) return

    // We're already displaying this note
    if (viewNotes.map((n) => n.path).includes(appendNote.path)) return

    // Find all notes that are stacked on top of this new index
    const newNotes = [...viewNotes.slice(0, index + 1), appendNote]
    setViewNotes(newNotes)

    // Set the stacked query (excluding the initial note - usually index)
    setStackedQuery(newNotes.map((note) => note.path))
  }

  const onScroll = () => {
    setScrollLeft(ref.current?.scrollLeft || 0)
  }

  const scrollToIndex = (index: number) => {
    ref.current?.scrollTo({
      left: index * NoteBrowserItemWidthWithoutCollapsed,
      behavior: 'smooth',
    })
  }

  const focusNoteAtIndex = useCallback((index: number) => {
    scrollToIndex(index)
  }, [])

  useEffect(() => {
    scrollToIndex(viewNotes.length - 1)
  }, [viewNotes])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const targetTagName = target?.tagName.toLowerCase()
      const targetAcceptsText =
        target?.isContentEditable ||
        targetTagName === 'input' ||
        targetTagName === 'select' ||
        targetTagName === 'textarea'

      if (event.key !== 'ArrowLeft' || targetAcceptsText) return
      if (!canGoBack) return

      event.preventDefault()
      goBack()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canGoBack, goBack])

  return (
    <div className="relative flex-1 overflow-hidden">
      <div
        ref={ref}
        className="browser h-full flex overflow-x-auto overflow-y-hidden"
        onScroll={onScroll}
      >
        {viewNotes.map((note, index) => (
          <NotesBrowserItem
            key={index + note.title}
            index={index}
            note={note}
            collapsed={
              scrollLeft > (index + 1) * NoteBrowserItemWidthWithoutCollapsed - 60
            }
            overlay={scrollLeft > (index - 1) * NoteBrowserItemWidthWithoutCollapsed}
            onClickBacklink={(event, path) => onClickBacklink(event, path, index)}
            onClickNote={() => focusNoteAtIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
