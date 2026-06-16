/**
 * Pet card — flat pastel, no gradients, no glow.
 * Icons via lucide-react. Edit pencil button top-right.
 */
import { Cat, Squirrel, Pencil, Cake, CheckCircle2 } from 'lucide-react'

const TYPE_STYLE = {
  Cat: {
    card:   'bg-[#fef9e7] border-[#f5e5a0]',   // uniform pale yellow — same as Hamster
    badge:  'bg-[#fde68a] text-[#78610a]',
    bar:    'bg-[#d4a017]',
    avatar: 'bg-[#fde68a]',
    Icon:   Cat,
  },
  Hamster: {
    card:   'bg-[#fef9e7] border-[#f5e5a0]',
    badge:  'bg-[#fde68a] text-[#78610a]',
    bar:    'bg-[#d4a017]',
    avatar: 'bg-[#fde68a]',
    Icon:   Squirrel,
  },
}

const FALLBACK_STYLE = {
  card:   'bg-[#f0ebe3] border-[#ddd5c8]',
  badge:  'bg-[#ddd5c8] text-[#5c4f3d]',
  bar:    'bg-[#c4a882]',
  avatar: 'bg-[#e8e0d5]',
  Icon:   Squirrel,
}

const ROUTINE_KEYS = [
  'meal_morning', 'meal_noon', 'meal_night',
  'water_refill', 'activity_playtime', 'activity_clean',
]

export default function PetCard({ pet, onClick, onEdit, isReadOnly }) {
  const routine = pet.routine || {}
  const total   = ROUTINE_KEYS.length
  const done    = ROUTINE_KEYS.filter(k => routine[k]).length
  const pct     = Math.round((done / total) * 100)

  const style    = TYPE_STYLE[pet.type] ?? FALLBACK_STYLE
  const TypeIcon = style.Icon

  function handleEditClick(e) {
    e.stopPropagation()
    onEdit(pet)
  }

  return (
    <div className={`relative ${style.card} border-2 rounded-3xl p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
      {/* Edit button — hidden in read-only / history mode */}
      {!isReadOnly && (
        <button
          onClick={handleEditClick}
          className="absolute top-3.5 right-3.5 w-8 h-8 flex items-center justify-center rounded-xl bg-white/80 hover:bg-white border border-[#ddd5c8] text-[#8a7968] hover:text-[#5c4f3d] transition-all"
          aria-label={`Edit ${pet.name}`}
          title="Edit pet"
        >
          <Pencil size={13} strokeWidth={2.5} />
        </button>
      )}

      {/* Clickable main area */}
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none active:scale-[0.98] transition-transform"
        aria-label={`View ${pet.name}'s daily routines`}
      >
        <div className="flex items-center gap-4 pr-8">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {pet.photo ? (
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-[72px] h-[72px] rounded-2xl object-cover border-2 border-white"
                onError={e => {
                  e.target.style.display = 'none'
                  const sib = e.target.nextElementSibling
                  if (sib) sib.style.display = 'flex'
                }}
              />
            ) : null}
            {/* Fallback avatar */}
            <div
              className={`${pet.photo ? 'hidden' : 'flex'} w-[72px] h-[72px] rounded-2xl items-center justify-center ${style.avatar} border-2 border-white`}
            >
              <TypeIcon size={32} strokeWidth={1.5} className="text-current opacity-70" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name + type badge */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-extrabold text-[#2d2520] text-[15px] leading-tight truncate">
                {pet.name}
              </h3>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                <TypeIcon size={10} strokeWidth={2.5} />
                {pet.type}
              </span>
            </div>

            {/* Age */}
            {pet.age && (
              <p className="text-xs text-[#7a6a58] font-medium mb-2 flex items-center gap-1">
                <Cake size={11} strokeWidth={2} />
                {pet.age}
              </p>
            )}

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#8a7968] mb-1.5">
                <span className="font-semibold">Daily routine</span>
                <span className={`font-bold ${pct === 100 ? 'text-[#3a7d44]' : 'text-[#5c4f3d]'}`}>
                  {done}/{total}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/10">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    pct === 100 ? 'bg-[#5cb85c]' : style.bar
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct === 100 && (
                <p className="text-xs text-[#3a7d44] font-bold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 size={12} strokeWidth={2.5} />
                  All done today!
                </p>
              )}
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
