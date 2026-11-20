import { useEffect, useRef } from 'react'
import Editor from '@toast-ui/editor'

export default function MarkdownEditor({ value = '', onChange, darkMode = false }) {
  const containerRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    const editor = new Editor({
      el: containerRef.current,
      height: '380px',
      initialEditType: 'markdown',
      previewStyle: 'tab',
      initialValue: value,
      theme: darkMode ? 'dark' : 'default',
      events: {
        change: () => {
          onChange?.(editor.getMarkdown())
        },
      },
    })
    instanceRef.current = editor
    return () => {
      editor.destroy()
    }
  }, [darkMode])

  useEffect(() => {
    if (instanceRef.current.getMarkdown() !== value) {
      instanceRef.current.setMarkdown(value)
    }
  }, [value])

  return <div ref={containerRef} data-testid="markdown-editor" />
}