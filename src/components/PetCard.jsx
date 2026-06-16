/**
 * Pet card — flat pastel, no gradients, no glow.
 * Icons via lucide-react. Edit pencil button top-right.
 */
import { Cat, Pencil, Cake, CheckCircle2 } from 'lucide-react'

// Custom Hamster Icon (menggantikan Squirrel)
const HamsterIcon = ({ size = 20, strokeWidth = 2, className = "" }) => (
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

const TYPE_STYLE = {
  Cat: {
    card:   'bg-[#fde8df] border-[#e8c9b8]',
    badge:  'bg-[#E07A5F] text-white',        // UBAH: background #E07A5F, text putih
    bar:    'bg-[#d4a017]',
    avatar: 'bg-[#f5d5c8]',
    Icon:   Cat,
  },
  Hamster: {
    card:   'bg-[#fde8df] border-[#e8c9b8]',
    badge:  'bg-[#E07A5F] text-white',        // UBAH: background #E07A5F, text putih
    bar:    'bg-[#d4a017]',
    avatar: 'bg-[#f5d5c8]',
    Icon:   HamsterIcon,
  },
}

const FALLBACK_STYLE = {
  card:   'bg-[#fde8df] border-[#e8c9b8]',
  badge:  'bg-[#E07A5F] text-white',          // UBAH: background #E07A5F, text putih
  bar:    'bg-[#c4a882]',
  avatar: 'bg-[#f5d5c8]',
  Icon:   HamsterIcon,
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
    <div className={`relative ${style.card} border-2 rounded-3xl p-4 sm:p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
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
        <div className="flex items-start gap-3 pr-8 sm:items-center sm:gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {pet.photo ? (
              <img
                src={pet.photo}
                alt={pet.name}
                className="h-16 w-16 rounded-2xl border-2 border-white object-cover sm:h-[72px] sm:w-[72px]"
                onError={e => {
                  e.target.style.display = 'none'
                  const sib = e.target.nextElementSibling
                  if (sib) sib.style.display = 'flex'
                }}
              />
            ) : null}
            {/* Fallback avatar */}
            <div
              className={`${pet.photo ? 'hidden' : 'flex'} h-16 w-16 items-center justify-center rounded-2xl border-2 border-white sm:h-[72px] sm:w-[72px] ${style.avatar}`}
            >
              <TypeIcon size={32} strokeWidth={1.5} className="text-[#7a5c38] opacity-70" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Name + type badge */}
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="min-w-0 font-extrabold text-[#2d2520] text-[15px] leading-tight break-words">
                {pet.name}
              </h3>
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                <TypeIcon size={10} strokeWidth={2.5} />
                {pet.type}
              </span>
            </div>

            {/* Age */}
            {pet.age && (
              <p className="text-xs text-[#7a6a58] font-medium mb-2 flex items-center gap-1 break-words">
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
