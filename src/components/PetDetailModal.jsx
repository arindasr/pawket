import { Cat, Squirrel, UtensilsCrossed, Droplets, Dumbbell, CalendarClock, Cake, Check, Trash2, CheckCircle2 } from 'lucide-react'
import Modal from './Modal'

const TYPE_ICON = { Cat, Hamster: Squirrel }

const ROUTINE_SECTIONS = [
  {
    label: 'Meals',
    Icon: UtensilsCrossed,
    items: [
      { key: 'meal_morning', label: 'Morning',  time: '07:00' },
      { key: 'meal_noon',    label: 'Noon',     time: '12:00' },
      { key: 'meal_night',   label: 'Night',    time: '19:00' },
    ],
  },
  {
    label: 'Water',
    Icon: Droplets,
    items: [
      { key: 'water_refill', label: 'Refill Water', time: null },
    ],
  },
  {
    label: 'Activity & Hygiene',
    Icon: Dumbbell,
    items: [
      { key: 'activity_playtime', label: 'Playtime / Bonding',      time: null },
      { key: 'activity_clean',    label: 'Clean Cage / Litter Box', time: null },
    ],
  },
]

export default function PetDetailModal({ pet, isOpen, onClose, onRoutineChange, onDelete, isReadOnly }) {
  if (!pet) return null

  const routine   = pet.routine || {}
  const allKeys   = ROUTINE_SECTIONS.flatMap(s => s.items.map(i => i.key))
  const done      = allKeys.filter(k => routine[k]).length
  const total     = allKeys.length
  const pct       = Math.round((done / total) * 100)
  const TypeIcon  = TYPE_ICON[pet.type] ?? Cat

  function toggle(key) {
    if (isReadOnly) return
    onRoutineChange(pet.id, { ...routine, [key]: !routine[key] })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${pet.name}'s Routine`}>
      <div className="space-y-5">
        {/* Read-only banner */}
        {isReadOnly && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[#fef9e7] border-2 border-[#f5e5a0] rounded-2xl">
            <CalendarClock size={16} strokeWidth={2} className="text-[#78610a] flex-shrink-0" />
            <p className="text-xs font-bold text-[#78610a]">
              View-only historical data — this day has already passed.
            </p>
          </div>
        )}

        {/* Pet summary header */}
        <div className="flex items-start gap-3 rounded-2xl border-2 border-[#ddd5c8] bg-[#f3f0eb] p-3 sm:items-center sm:gap-4 sm:p-4">
          {pet.photo ? (
            <img
              src={pet.photo}
              alt={pet.name}
              className="h-14 w-14 flex-shrink-0 rounded-2xl border-2 border-white object-cover sm:h-16 sm:w-16"
            />
          ) : (
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-[#ddd5c8] bg-white sm:h-16 sm:w-16">
              <TypeIcon size={32} strokeWidth={1.5} className="text-[#c4a882]" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="break-words text-lg font-extrabold leading-tight text-[#2d2520]">{pet.name}</h3>
            {pet.age && (
              <p className="text-xs text-[#8a7968] font-medium mt-0.5 flex items-center gap-1">
                <Cake size={11} strokeWidth={2} />{pet.age}
              </p>
            )}
            <p className="text-xs text-[#9e8e7e] font-semibold mt-0.5">{pet.type}</p>
            <div className="mt-2.5">
              <div className="flex justify-between text-xs text-[#8a7968] mb-1">
                <span>{isReadOnly ? 'Completion' : "Today's progress"}</span>
                <span className="font-bold text-[#5c4f3d]">{pct}%</span>
              </div>
              <div className="w-full h-2 bg-[#ddd5c8] rounded-full">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    pct === 100 ? 'bg-[#5cb85c]' : 'bg-[#e07a5f]'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Completion badge */}
        {pct === 100 && (
          <div className="flex items-center justify-center gap-2 py-2.5 bg-[#edf7ee] border-2 border-[#a8d5aa] rounded-2xl">
            <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#3a7d44]" />
            <p className="text-[#3a7d44] font-bold text-sm">All routines completed!</p>
          </div>
        )}

        {/* Checklist sections */}
        {ROUTINE_SECTIONS.map(({ label, Icon: SectionIcon, items }) => (
          <div key={label}>
            <h4 className="flex items-center gap-1.5 text-xs font-extrabold text-[#5c4f3d] uppercase tracking-wider mb-2.5">
              <SectionIcon size={13} strokeWidth={2.5} />
              {label}
            </h4>
            <div className="space-y-2">
              {items.map(item => {
                const checked = !!routine[item.key]
                return (
                  <label
                    key={item.key}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-colors ${
                      isReadOnly ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      checked
                        ? 'bg-[#edf7ee] border-[#a8d5aa]'
                        : 'bg-white border-[#ddd5c8] hover:border-[#c4b9a8]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(item.key)}
                      disabled={isReadOnly}
                      className="sr-only"
                    />
                    {/* Custom checkbox */}
                    <div
                      className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        checked
                          ? 'bg-[#5cb85c] border-[#5cb85c] text-white'
                          : 'border-[#c4b9a8] bg-white'
                      }`}
                    >
                      {checked && <Check size={11} strokeWidth={3} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`text-sm font-semibold ${checked ? 'line-through text-[#b0a898]' : 'text-[#3d3530]'}`}>
                        {item.label}
                      </span>
                      {item.time && (
                        <span className={`ml-0 block text-xs min-[380px]:ml-2 min-[380px]:inline ${checked ? 'text-[#c4b9a8]' : 'text-[#9e8e7e]'}`}>
                          {item.time}
                        </span>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        ))}

        {/* Delete — hidden in history view */}
        {!isReadOnly && (
          <div className="pt-2 border-t-2 border-[#ede8e0]">
            <button
              onClick={() => { onDelete(pet.id); onClose() }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-[#f4c2b8] text-[#c0392b] text-sm font-bold hover:bg-[#fdf0ed] transition-colors"
            >
              <Trash2 size={14} strokeWidth={2.5} />
              Remove {pet.name} from Pawket
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
