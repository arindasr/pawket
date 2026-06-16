import { useState } from 'react'
import { Plus, Cat, Squirrel, Shapes, CalendarDays } from 'lucide-react'
import PetCard from './PetCard'
import PetDetailModal from './PetDetailModal'
import EditPetModal from './EditPetModal'
import { todayKey, formatDateLabel } from '../utils/dateUtils'

// Filter definitions — icons swapped to lucide, active uses themed pastels
const FILTERS = [
  { key: 'All',     label: 'All',      Icon: Shapes  },
  { key: 'Cat',     label: 'Cats',     Icon: Cat     },
  { key: 'Hamster', label: 'Hamsters', Icon: Squirrel },
]

export default function Dashboard({
  pets,
  onAddPet,
  onRoutineChange,
  onDeletePet,
  onEditPet,
  currentDateKey,
  onOpenHistory,
}) {
  const [filter, setFilter]         = useState('All')
  const [detailPet, setDetailPet]   = useState(null)
  const [editingPet, setEditingPet] = useState(null)

  const isReadOnly = currentDateKey !== todayKey()
  const filtered   = filter === 'All' ? pets : pets.filter(p => p.type === filter)

  const counts = { All: pets.length, Cat: 0, Hamster: 0 }
  pets.forEach(p => { if (counts[p.type] !== undefined) counts[p.type]++ })

  const dateLabel = formatDateLabel(currentDateKey, true)

  return (
    <div className="pb-8">
      {/* ── Sub-header ───────────────────────────────── */}
      <div className="px-5 sm:px-8 pt-8 pb-6">
        <div className="flex flex-wrap items-start gap-4 justify-between">
          {/* Left: greeting + date */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2d2520] tracking-tight leading-tight">
              Hello Pawrents!
            </h1>
            <p className="text-base sm:text-lg text-[#9e8e7e] font-medium mt-1">
              Here are your beloved babies
            </p>

            {/* Date — plain subtle text, no badge/button styling */}
            <div className="flex items-center gap-1.5 mt-2">
              <CalendarDays size={13} strokeWidth={2} className="text-[#9e8e7e]" />
              <span className="text-sm text-[#9e8e7e] font-medium">{dateLabel}</span>
              {isReadOnly && (
                <span className="text-xs text-[#78610a] bg-[#fef9e7] border border-[#f5e5a0] font-bold px-2 py-0.5 rounded-full ml-1">
                  view only
                </span>
              )}
            </div>
          </div>

          {/* Add Pet — warm coral, matches peach palette */}
          {!isReadOnly && (
            <button
              onClick={onAddPet}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#e07a5f] text-white font-bold text-sm hover:bg-[#c96a50] active:scale-95 transition-all"
              aria-label="Add a new pet"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="hidden sm:inline">Add Pet</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Filter tabs ───────────────────────────────── */}
      <div className="px-5 sm:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map(({ key, label, Icon }) => {
            const active = filter === key
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-colors ${
                  active
                    ? 'bg-[#ede8e0] border-[#d9c8aa] text-[#7a5c38]'
                    : 'bg-white border-[#ddd5c8] text-[#8a7968] hover:border-[#c4b9a8] hover:bg-[#f5f2ed]'
                }`}
              >
                <Icon size={14} strokeWidth={2.5} />
                {label}
                <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                  active
                    ? 'bg-[#d9c8aa] text-[#7a5c38]'
                    : 'bg-[#f0ebe3] text-[#7a6a58]'
                }`}>
                  {counts[key]}
                </span>
              </button>
            )
          })}
          </div>
        </div>
      </div>

      {/* ── Pet Cards — 2-column grid aligned to header width ── */}
      <div className="px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#b0a898]">
              <Shapes size={40} className="mx-auto mb-3 opacity-40" strokeWidth={1.5} />
              <p className="text-sm font-semibold">
                No {filter === 'All' ? 'pets' : filter.toLowerCase() + 's'} found.
              </p>
              {filter !== 'All' && (
                <button
                  onClick={() => setFilter('All')}
                  className="mt-4 text-[#e07a5f] text-sm font-bold"
                >
                  Show all pets
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(pet => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onClick={() => setDetailPet(pet)}
                  onEdit={p => setEditingPet(p)}
                  isReadOnly={isReadOnly}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Routine detail modal ─────────────────────── */}
      <PetDetailModal
        pet={detailPet}
        isOpen={!!detailPet}
        onClose={() => setDetailPet(null)}
        isReadOnly={isReadOnly}
        onRoutineChange={(petId, routine) => {
          onRoutineChange(petId, routine)
          setDetailPet(prev => prev ? { ...prev, routine } : null)
        }}
        onDelete={onDeletePet}
      />

      {/* ── Edit pet modal ───────────────────────────── */}
      <EditPetModal
        pet={editingPet}
        isOpen={!!editingPet}
        onClose={() => setEditingPet(null)}
        onSave={updated => {
          onEditPet(updated)
          setEditingPet(null)
        }}
      />
    </div>
  )
}
