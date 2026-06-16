import { useState } from 'react'
import { Plus, Cat, Shapes, CalendarDays } from 'lucide-react'
import PetCard from './PetCard'
import PetDetailModal from './PetDetailModal'
import EditPetModal from './EditPetModal'
import { todayKey, formatDateLabel } from '../utils/dateUtils'

// Custom Hamster Icon
const HamsterIcon = ({ size = 14, strokeWidth = 2.5, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <ellipse cx="12" cy="14" rx="8" ry="6" />
    <circle cx="12" cy="10" r="5" />
    <circle cx="8" cy="6" r="2.5" />
    <circle cx="16" cy="6" r="2.5" />
    <circle cx="10" cy="9" r="1" fill="currentColor" />
    <circle cx="14" cy="9" r="1" fill="currentColor" />
    <ellipse cx="12" cy="11.5" rx="1" ry="0.7" fill="currentColor" />
    <circle cx="8.5" cy="11" r="1.5" fill="currentColor" opacity="0.3" />
    <circle cx="15.5" cy="11" r="1.5" fill="currentColor" opacity="0.3" />
    <path d="M4 14 Q2 12 3 10" />
    <ellipse cx="8" cy="19" rx="2" ry="1" />
    <ellipse cx="16" cy="19" rx="2" ry="1" />
  </svg>
)

const FILTERS = [
  { key: 'All',     label: 'All',      Icon: Shapes  },
  { key: 'Cat',     label: 'Cats',     Icon: Cat     },
  { key: 'Hamster', label: 'Hamsters', Icon: HamsterIcon },
]

export default function Dashboard({
  pets,
  onAddPet,
  onRoutineChange,
  onDeletePet,
  onEditPet,
  currentDateKey,
}) {
  const [filter, setFilter] = useState('All')
  const [detailPet, setDetailPet] = useState(null)
  const [editingPet, setEditingPet] = useState(null)

  const isReadOnly = currentDateKey !== todayKey()
  const filtered = filter === 'All' ? pets : pets.filter(p => p.type === filter)

  const counts = { All: pets.length, Cat: 0, Hamster: 0 }
  pets.forEach(p => { if (counts[p.type] !== undefined) counts[p.type]++ })

  const dateLabel = formatDateLabel(currentDateKey, true)

  return (
    <div className="min-h-full bg-[#f7f4ef] pb-8">
      {/* ── Sub-header ── */}
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-[clamp(2rem,12vw,3.75rem)] font-extrabold text-[#2d2520] tracking-tight leading-tight">
              A happy pet,
            </h1>
            <h1 className="text-[clamp(2rem,12vw,3.75rem)] font-extrabold text-[#2d2520] tracking-tight leading-tight">
              a happy home.
            </h1>
            <p className="text-base sm:text-lg text-[#9e8e7e] font-medium mt-3">
              Here are your beloved babies
            </p>

            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
              <CalendarDays size={13} strokeWidth={2} className="text-[#9e8e7e]" />
              <span className="text-sm text-[#9e8e7e] font-medium">{dateLabel}</span>
              {isReadOnly && (
                <span className="text-xs text-[#78610a] bg-[#fef9e7] border border-[#f5e5a0] font-bold px-2 py-0.5 rounded-full ml-1">
                  view only
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter tabs + Add Pet ── */}
      <div className="px-4 sm:px-8 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
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

            {!isReadOnly && (
              <button
                onClick={onAddPet}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e07a5f] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#c96a50] active:scale-95 sm:w-auto sm:flex-shrink-0 sm:py-2"
                aria-label="Add a new pet"
              >
                <Plus size={16} strokeWidth={3} />
                <span>Add Pet</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Pet Cards ── */}
      <div className="px-4 sm:px-8">
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

      {/* ── Modals ── */}
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
