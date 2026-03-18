import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ModalSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function ModalSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  className
}: ModalSheetProps) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onOpenChange])

  if (!open || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="关闭弹层"
        className="absolute inset-0 bg-stone-950/35 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="absolute inset-x-0 bottom-0 flex max-h-full justify-end md:inset-y-0 md:left-auto">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            'pointer-events-auto mt-auto flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[26px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,252,248,0.98),rgba(255,247,239,0.96))] shadow-[0_22px_64px_rgba(70,42,24,0.24)] md:mt-0 md:h-full md:max-h-none md:w-[500px] md:rounded-none md:rounded-l-[26px]',
            className
          )}
        >
          <div className="flex items-start justify-between gap-3 border-b border-border/70 px-4 pb-3.5 pt-4 md:px-5 md:pt-5">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              {description && (
                <p className="text-sm leading-5 text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
