"use client"

// Simplified version of shadcn/ui toast
import { useState, useEffect } from "react"

type ToastProps = {
  title?: string
  description?: string
  duration?: number
}

type ToastState = ToastProps & {
  id: string
  visible: boolean
}

const toasts: ToastState[] = []
let listeners: Array<(toasts: ToastState[]) => void> = []

const addToast = (toast: ToastProps) => {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast = { ...toast, id, visible: true }
  toasts.push(newToast)
  listeners.forEach((listener) => listener([...toasts]))

  if (toast.duration !== Number.POSITIVE_INFINITY) {
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 3000)
  }
}

const removeToast = (id: string) => {
  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts[index].visible = false
    listeners.forEach((listener) => listener([...toasts]))

    setTimeout(() => {
      const removeIndex = toasts.findIndex((toast) => toast.id === id)
      if (removeIndex !== -1) {
        toasts.splice(removeIndex, 1)
        listeners.forEach((listener) => listener([...toasts]))
      }
    }, 300) // Animation duration
  }
}

export function useToast() {
  const [toastState, setToastState] = useState<ToastState[]>(toasts)

  useEffect(() => {
    listeners.push(setToastState)
    return () => {
      listeners = listeners.filter((listener) => listener !== setToastState)
    }
  }, [])

  return {
    toast: addToast,
    toasts: toastState,
    dismiss: removeToast,
  }
}

