import { useState } from 'react'
import { NotebookPen, Plus, X, MessageCircle, PawPrint } from 'lucide-react'

// Single uniform note style — clean off-white, no random colors
const NOTE_STYLE = {
  bg:     'bg-[#fdfaf6]',
  border: 'border-[#e8e0d5]',
  text:   'text-[#5c4f3d]',
}

export default function NotesSection({ notes, onAdd, onDelete }) {
  const [input, setInput] = useState('')

  function handleAdd(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    onAdd({
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
    })
    setInput('')
  }

  return (
    <section>
      {/* Heading */}
      <div className="flex items-center gap-2 mb-5">
        <NotebookPen size={20} strokeWidth={2} className="text-[#c4a882]" />
        <h2 className="text-lg font-extrabold text-[#2d2520]">Pawrents Notes</h2>
        {notes.length > 0 && (
          <span className="text-xs bg-[#fde8df] border border-[#f4cbb8] text-[#9b4b2c] font-bold px-2 py-0.5 rounded-full">
            {notes.length}
          </span>
        )}
      </div>

      {/* Input row */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Makanan Chester mau abis!"
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#ddd5c8] focus:border-[#c4a882] focus:outline-none text-sm text-[#3d3530] placeholder-[#c4b9a8] bg-white"
          maxLength={200}
        />
        <button
          type="submit"
          className="px-5 py-3 rounded-2xl bg-[#e07a5f] text-white font-bold text-sm hover:bg-[#c96a50] active:scale-95 transition-all flex-shrink-0"
          aria-label="Add note"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </form>

      {/* Empty state */}
      {notes.length === 0 ? (
        <div className="text-center py-12 text-[#b0a898]">
          <MessageCircle size={36} className="mx-auto mb-3 opacity-40" strokeWidth={1.5} />
          <p className="text-sm font-medium">No reminders yet. Add a supply note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...notes].reverse().map(note => (
            <div
              key={note.id}
              className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border-2 ${NOTE_STYLE.bg} ${NOTE_STYLE.border}`}
            >
              <PawPrint size={14} strokeWidth={2} className={`mt-0.5 flex-shrink-0 ${NOTE_STYLE.text} opacity-40`} />
              <p className={`flex-1 text-sm font-semibold leading-relaxed break-words ${NOTE_STYLE.text}`}>
                {note.text}
              </p>
              <button
                onClick={() => onDelete(note.id)}
                className={`flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity mt-0.5 ${NOTE_STYLE.text}`}
                aria-label="Delete note"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
