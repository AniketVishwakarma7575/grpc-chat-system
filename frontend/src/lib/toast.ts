import { GooeyToaster, gooeyToast, type GooeyToastAction, type GooeyToastOptions, type GooeyToastUpdateOptions } from 'goey-toast'

export { GooeyToaster }

export interface NotifyOptions extends Omit<GooeyToastOptions, 'id'> {
  id?: string | number
  roomId?: string
}

type ToastKind = 'success' | 'error' | 'warning' | 'info'
type ToastId = string | number

const activeIds = new Map<string, ToastId>()
let activeRoomId: string | null = null

export function setToastActiveRoom(roomId: string | null): void {
  activeRoomId = roomId
}

function show(kind: ToastKind, title: string, options: NotifyOptions = {}): ToastId | null {
  const { id, roomId, ...toastOptions } = options
  if (roomId && roomId === activeRoomId) return null

  if (id !== undefined && activeIds.has(String(id))) {
    gooeyToast.update(id, {
      title,
      description: toastOptions.description,
      action: toastOptions.action,
      type: kind,
    })
    return id
  }

  const key = id === undefined ? undefined : String(id)
  const clearId = () => {
    if (key) activeIds.delete(key)
  }
  const result = gooeyToast[kind](title, {
    ...toastOptions,
    id,
    onDismiss: (dismissedId) => {
      clearId()
      toastOptions.onDismiss?.(dismissedId)
    },
    onAutoClose: (closedId) => {
      clearId()
      toastOptions.onAutoClose?.(closedId)
    },
  })
  if (key) activeIds.set(key, result)
  return result
}

export const notify = {
  success: (title: string, options?: NotifyOptions) => show('success', title, options),
  error: (title: string, options?: NotifyOptions) => show('error', title, options),
  warning: (title: string, options?: NotifyOptions) => show('warning', title, options),
  info: (title: string, options?: NotifyOptions) => show('info', title, options),
  promise: <T,>(promise: Promise<T>, data: Parameters<typeof gooeyToast.promise<T>>[1]) =>
    gooeyToast.promise(promise, data),
  update: (id: ToastId, options: GooeyToastUpdateOptions) => gooeyToast.update(id, options),
  dismiss: (id?: ToastId) => {
    if (id !== undefined) {
      activeIds.delete(String(id))
    } else {
      activeIds.clear()
    }
    gooeyToast.dismiss(id)
  },
}

export type { GooeyToastAction }
