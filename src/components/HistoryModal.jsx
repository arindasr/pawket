import { MapPin, Clock3, CheckCircle2 } from 'lucide-react'
import Modal from './Modal'
import { lastNDays, formatDateLabel, todayKey, dailyStorageKey } from '../utils/dateUtils'

export default function HistoryModal({ isOpen, onClose, currentDateKey, onSelectDate }) {
  const days  = lastNDays(7)
  const today = todayKey()

  function hasData(dateKey) {
    try { return !!window.localStorage.getItem(dailyStorageKey(dateKey)) }
    catch { return false }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily History">
      <div className="space-y-3">
        <p className="text-xs text-[#9e8e7e] font-medium mb-4">
          Select a day to review routines. Past dates are view-only.
        </p>

        {days.map(dateKey => {
          const isCurrent = dateKey === currentDateKey
          const isToday   = dateKey === today
          const isPast    = dateKey < today
          const recorded  = hasData(dateKey)

          return (
            <button
              key={dateKey}
              onClick={() => { onSelectDate(dateKey); onClose() }}
              className={`flex w-full flex-col gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between ${
                isCurrent
                  ? 'bg-[#fde8df] border-[#f4cbb8] text-[#9b4b2c]'
                  : 'bg-white border-[#ddd5c8] hover:border-[#c4b9a8] text-[#3d3530]'
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                {isToday
                  ? <MapPin size={15} strokeWidth={2.5} className="text-[#e07a5f] flex-shrink-0" />
                  : <Clock3 size={15} strokeWidth={2} className="text-[#b0a898] flex-shrink-0" />
                }
                <div className="min-w-0">
                  <p className="text-sm font-bold">
                    {isToday ? 'Today' : dateKey}
                  </p>
                  <p className="mt-0.5 text-xs text-[#9e8e7e]">
                    {formatDateLabel(dateKey)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 min-[420px]:justify-end">
                {recorded && (
                  <span className="flex items-center gap-1 text-[10px] bg-[#e8f8f0] text-[#1a5c34] border border-[#a8d5aa] font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={9} strokeWidth={2.5} />
                    recorded
                  </span>
                )}
                {isPast && (
                  <span className="text-[10px] text-[#b0a898] font-semibold">view only</span>
                )}
                {isCurrent && (
                  <span className="text-[10px] text-[#9b4b2c] font-extrabold">← viewing</span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}
