import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'sm:max-w-lg' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className={`relative w-full ${maxWidth} bg-[#fdfaf6] rounded-t-3xl sm:rounded-3xl shadow-lg max-h-[92vh] flex flex-col overflow-hidden border-2 border-[#e8e0d5]`}>
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#d9d0c4]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#ede8e0]">
          <h2 className="text-base font-bold text-[#3d3530]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ede8e0] text-[#8a7968] hover:bg-[#e0d8cc] transition-colors"
            aria-label="Close modal"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}
