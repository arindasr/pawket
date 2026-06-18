// AddNoteModal.jsx
import { useState } from 'react'
import { X, NotebookPen } from 'lucide-react'

export default function AddNoteModal({ isOpen, onClose, onAdd }) {
  const [text, setText] = useState('')

  if (!isOpen) return null

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-[#e3d8cc]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-[#b0a898] hover:bg-[#f5f2ed] hover:text-[#7a5c38]"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fde8df]">
              <NotebookPen size={20} strokeWidth={2.5} className="text-[#e07a5f]" />
            </div>
            <h2 className="text-xl font-black text-[#2d2520]">Add Note</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="note" className="block text-sm font-bold text-[#5c4f3d] mb-2">
                What would you like to remember?
              </label>
              <textarea
                id="note"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Makanan Chester mau abis!"
                className="w-full rounded-xl border-2 border-[#ddd5c8] bg-[#fdfaf6] px-4 py-3 text-sm text-[#3d3530] placeholder-[#c4b9a8] focus:border-[#c4a882] focus:outline-none resize-none"
                rows={4}
                maxLength={200}
                autoFocus
              />
              <div className="mt-1 text-right text-xs text-[#b0a898]">
                {text.length}/200
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-[#ddd5c8] px-4 py-2.5 text-sm font-bold text-[#8a7968] hover:bg-[#f5f2ed] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex-1 rounded-xl bg-[#e07a5f] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#c96a50] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}