import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockSuccess, mockInfo, mockUpdate, mockDismiss } = vi.hoisted(() => ({
  mockSuccess: vi.fn(() => 'success-toast'),
  mockInfo: vi.fn(() => 'info-toast'),
  mockUpdate: vi.fn(),
  mockDismiss: vi.fn(),
}))

vi.mock('goey-toast', async () => {
  const actual = await vi.importActual<typeof import('goey-toast')>('goey-toast')
  return {
    ...actual,
    GooeyToaster: () => null,
    gooeyToast: {
      dismiss: mockDismiss,
      error: vi.fn(),
      info: mockInfo,
      promise: vi.fn(),
      success: mockSuccess,
      update: mockUpdate,
      warning: vi.fn(),
    },
  }
})

import { notify, setToastActiveRoom } from './toast'

describe('notify', () => {
  beforeEach(() => {
    setToastActiveRoom(null)
  })

  it('updates an existing toast instead of duplicating the same id', () => {
    notify.success('First', { id: 'connection' })
    notify.info('Updated', { id: 'connection', description: 'Back online' })

    expect(mockSuccess).toHaveBeenCalledTimes(1)
    expect(mockUpdate).toHaveBeenCalledWith('connection', {
      action: undefined,
      description: 'Back online',
      title: 'Updated',
      type: 'info',
    })
  })

  it('suppresses a room notification while that room is active', () => {
    setToastActiveRoom('room-1')

    expect(notify.info('New message', { roomId: 'room-1' })).toBeNull()
    expect(mockInfo).not.toHaveBeenCalled()
  })

  it('allows notifications for other rooms', () => {
    setToastActiveRoom('room-1')

    expect(notify.info('New message', { roomId: 'room-2' })).toBe('info-toast')
    expect(mockInfo).toHaveBeenCalledOnce()
  })
})
