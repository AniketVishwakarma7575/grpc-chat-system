import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppProviders } from '../../app/providers'
import { WorkspaceDemo } from './WorkspaceDemo'

describe('WorkspaceDemo', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: (query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    })
  })

  it('signs in, switches rooms, sends a local message, and opens search', async () => {
    const user = userEvent.setup()
    render(<AppProviders><WorkspaceDemo /></AppProviders>)

    await user.click(screen.getByRole('button', { name: /explore the demo workspace/i }))
    expect(screen.getByRole('heading', { name: /good morning, alex/i })).toBeInTheDocument()

    await user.click(within(screen.getByRole('navigation', { name: 'Rooms' })).getByRole('button', { name: /design-room/i }))
    expect(screen.getByRole('region', { name: 'design-room conversation' })).toBeInTheDocument()

    const composer = screen.getByRole('textbox', { name: 'Message #design-room' })
    await user.type(composer, 'A note from the demo')
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(screen.getByText('A note from the demo')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(screen.getByRole('dialog', { name: 'Search workspace' })).toBeInTheDocument()
    await user.click(within(screen.getByRole('dialog', { name: 'Search workspace' })).getByRole('button', { name: /general/i }))
    expect(screen.getByRole('region', { name: 'general conversation' })).toBeInTheDocument()
  })
})
