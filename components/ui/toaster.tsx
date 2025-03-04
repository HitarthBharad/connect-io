"use client"

import { useToast } from "@/components/ui/use-toast"
import { X } from "lucide-react"

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-background border rounded-lg shadow-lg p-4 transition-all duration-300 transform ${
            toast.visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <div className="flex justify-between items-start">
            {toast.title && <h3 className="font-medium">{toast.title}</h3>}
            <button onClick={() => dismiss(toast.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          {toast.description && <p className="text-sm text-muted-foreground mt-1">{toast.description}</p>}
        </div>
      ))}
    </div>
  )
}

