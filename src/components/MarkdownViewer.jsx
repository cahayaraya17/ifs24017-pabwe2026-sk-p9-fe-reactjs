import { useEffect, useRef } from 'react'
import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer'

export default function MarkdownViewer({ content = '', darkMode = false }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const viewer = new Viewer({
      el: containerRef.current,
      initialValue: content,
      theme: darkMode ? 'dark' : 'default',
    })
    return () => {
      viewer.destroy()
    }
  }, [content, darkMode])

  return <div ref={containerRef} data-testid="markdown-viewer" />
}