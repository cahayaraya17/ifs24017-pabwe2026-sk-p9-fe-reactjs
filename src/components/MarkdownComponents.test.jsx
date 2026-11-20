import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import MarkdownEditor from './MarkdownEditor'
import MarkdownViewer from './MarkdownViewer'

let triggerChange = null
const mockSetMarkdown = vi.fn()
const mockGetMarkdown = vi.fn(() => 'initial')

vi.mock('@toast-ui/editor', () => {
  return {
    default: vi.fn().mockImplementation(function (opts) {
      triggerChange = opts.events?.change
      return {
        getMarkdown: mockGetMarkdown,
        setMarkdown: mockSetMarkdown,
        destroy: vi.fn(),
      }
    }),
  }
})

vi.mock('@toast-ui/editor/dist/toastui-editor-viewer', () => {
  return {
    default: vi.fn().mockImplementation(function () {
      return { destroy: vi.fn() }
    }),
  }
})

describe('MarkdownEditor & MarkdownViewer', () => {
  it('renders editor, triggers onChange, and syncs value', () => {
    const onChange = vi.fn()
    const { rerender, unmount } = render(
      <MarkdownEditor value="initial" onChange={onChange} darkMode={false} />
    )
    if (triggerChange) triggerChange()
    expect(onChange).toHaveBeenCalledWith('initial')

    rerender(<MarkdownEditor value="updated" onChange={onChange} darkMode={true} />)
    expect(mockSetMarkdown).toHaveBeenCalledWith('updated')

    rerender(<MarkdownEditor value="" darkMode={true} />)
    if (triggerChange) triggerChange()
    unmount()
  })

  it('renders viewer in light and dark mode', () => {
    const { rerender, unmount } = render(<MarkdownViewer content="# Hello" darkMode={false} />)
    rerender(<MarkdownViewer content="" darkMode={true} />)
    unmount()
  })
})