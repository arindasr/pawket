import { useState } from 'react'
import { 
  NotebookPen, Plus, X, MessageCircle, PawPrint,
  Sparkles, Tag, Calendar
} from 'lucide-react'

// Filter categories
const FILTERS = [
  { id: 'all', label: 'All Notes', icon: NotebookPen },
  { id: 'bypet', label: 'By Pet', icon: Tag },
]

export default function NotesSection({ notes, onAdd, onDelete }) {
  const [input, setInput] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedPet, setSelectedPet] = useState(null)

  // Get unique pet names from notes
  const petNames = [...new Set(notes.map(n => n.petName).filter(Boolean))]

  function handleAdd(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    onAdd({
      id: crypto.randomUUID(),
      text,
      petName: selectedPet || 'General',
      createdAt: Date.now(),
    })
    setInput('')
    setSelectedPet(null)
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (targetDate.getTime() === today.getTime()) {
      return 'Today • ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ' • ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (activeFilter === 'bypet' && selectedPet) return note.petName === selectedPet
    return true
  })

  // Group by pet for "By Pet" view
  const groupedByPet = filteredNotes.reduce((groups, note) => {
    const key = note.petName || 'General'
    if (!groups[key]) groups[key] = []
    groups[key].push(note)
    return groups
  }, {})

  return (
    <div className="max-w-7xl mx-auto">
      {/* ── Header with stats circle ──────────────────── */}
      <div className="flex flex-col gap-4 border-b border-[#ede8e0] pt-5 pb-6 sm:flex-row sm:items-start sm:justify-between sm:pt-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles size={24} strokeWidth={2.5} className="flex-shrink-0 text-[#e07a5f]" />
            <h2 className="text-[clamp(2rem,10vw,3rem)] font-extrabold text-[#2d2520] tracking-tight leading-tight">
              Pawrents Notes
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#9e8e7e] font-medium mt-1">
            Jot down important things for your fur babies
          </p>
          <p className="text-sm text-[#b0a898] mt-0.5">
            Little notes, big love.
          </p>
        </div>

        {/* Stats Circle */}
        <div className="flex h-20 w-20 flex-shrink-0 flex-col items-center justify-center rounded-full border-2 border-[#f4cbb8] bg-[#fde8df] sm:h-24 sm:w-24">
          <span className="text-3xl font-extrabold text-[#7a5c38] sm:text-4xl">{notes.length}</span>
          <span className="text-[10px] font-bold text-[#9b4b2c] uppercase tracking-wide">Notes</span>
        </div>
      </div>

      {/* ── Input row ──────────────────────────────────── */}
      <form onSubmit={handleAdd} className="flex gap-2 mt-6 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. Makanan Chester mau abis!"
          className="min-w-0 flex-1 rounded-2xl border-2 border-[#ddd5c8] bg-white px-4 py-3 text-sm text-[#3d3530] placeholder-[#c4b9a8] focus:border-[#c4a882] focus:outline-none"
          maxLength={200}
        />
        <button
          type="submit"
          className="flex-shrink-0 rounded-2xl bg-[#e07a5f] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#c96a50] active:scale-95 sm:px-5"
          aria-label="Add note"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </form>

      {/* ── Filters ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[#e8e0d5] pb-4">
        {FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActiveFilter(id)
              if (id !== 'bypet') setSelectedPet(null)
            }}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all
              ${activeFilter === id
                ? 'bg-[#ede8e0] text-[#7a5c38]'
                : 'text-[#b0a898] hover:text-[#7a6a58] hover:bg-[#f5f2ed]'
              }
            `}
          >
            <Icon size={12} strokeWidth={2.5} />
            {label}
          </button>
        ))}
        
        {/* Pet selector for "By Pet" filter */}
        {activeFilter === 'bypet' && (
          <select
            value={selectedPet || ''}
            onChange={(e) => setSelectedPet(e.target.value || null)}
            className="w-full rounded-xl border-2 border-[#e8e0d5] bg-[#fdfaf6] px-3 py-1.5 text-xs font-bold outline-none focus:border-[#c4a882] sm:w-auto"
          >
            <option value="">Select pet...</option>
            {petNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* ── Notes List ─────────────────────────────────── */}
      {notes.length === 0 ? (
        <div className="text-center py-12 text-[#b0a898]">
          <MessageCircle size={36} className="mx-auto mb-3 opacity-40" strokeWidth={1.5} />
          <p className="text-sm font-medium">No reminders yet. Add a supply note!</p>
        </div>
      ) : activeFilter === 'bypet' ? (
        // Group by pet view
        <div className="space-y-6">
          {Object.entries(groupedByPet).map(([petName, petNotes]) => (
            <div key={petName}>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={14} strokeWidth={2} className="text-[#e07a5f]" />
                <h3 className="text-sm font-extrabold text-[#2d2520]">{petName}</h3>
                <span className="text-xs text-[#b0a898]">({petNotes.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {petNotes.map(note => (
                  <NoteCard key={note.id} note={note} onDelete={onDelete} formatDate={formatDate} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Normal list view
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} onDelete={onDelete} formatDate={formatDate} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Note Card Component ──────────────────────────────────
function NoteCard({ note, onDelete, formatDate }) {
  return (
    <div className="bg-[#fdfaf6] border-2 border-[#e8e0d5] rounded-xl p-4 hover:border-[#d9c8aa] transition-all group">
      <div className="flex items-start gap-3">
        <PawPrint size={14} strokeWidth={2} className="mt-0.5 flex-shrink-0 text-[#b0a898] opacity-40" />
        <div className="flex-1 min-w-0">
          {/* Pet name tag */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-[#b0a898] bg-[#f5f2ed] px-2 py-0.5 rounded-full">
              {note.petName || 'General'}
            </span>
          </div>
          
          {/* Content */}
          <p className="text-sm font-semibold text-[#5c4f3d] leading-relaxed break-words">
            {note.text}
          </p>
          
          {/* Date */}
          <p className="text-[10px] text-[#b0a898] mt-2 flex items-center gap-1">
            <Calendar size={10} strokeWidth={2} />
            {formatDate(note.createdAt)}
          </p>
        </div>
        
        <button
          onClick={() => onDelete(note.id)}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[#b0a898] transition-opacity hover:bg-[#fde8df] hover:text-[#e07a5f] sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Delete note"
        >
          <X size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
