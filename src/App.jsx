import { useState, useEffect, useCallback } from 'react'
import { PawPrint, NotebookPen, CalendarDays, Heart } from 'lucide-react'
import {
  todayKey,
  dailyStorageKey,
  PETS_KEY,
  NOTES_KEY,
  DEFAULT_ROUTINE,
} from './utils/dateUtils'
import EmptyState from './components/EmptyState'
import Dashboard from './components/Dashboard'
import NotesSection from './components/NotesSection'
import AddPetModal from './components/AddPetModal'
import HistoryModal from './components/HistoryModal'

// ── localStorage helpers ──────────────────────────────────
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) }
  catch (e) { console.error('localStorage write failed:', e) }
}

function buildDailySnapshot(petProfiles) {
  const routines = {}
  petProfiles.forEach(p => { routines[p.id] = { ...DEFAULT_ROUTINE } })
  return { routines }
}

function applyRoutines(petProfiles, dailyData) {
  const routines = dailyData?.routines || {}
  return petProfiles.map(p => ({
    ...p,
    routine: routines[p.id] ?? { ...DEFAULT_ROUTINE },
  }))
}

// ── Tabs ──────────────────────────────────────────────────
const TABS = [
  { key: 'pets',  label: 'My Pets', Icon: PawPrint },
  { key: 'notes', label: 'Notes',   Icon: NotebookPen },
]

// ─────────────────────────────────────────────────────────
export default function App() {
  const [petProfiles, setPetProfiles]   = useState(() => lsGet(PETS_KEY, []))
  const [notes, setNotes]               = useState(() => lsGet(NOTES_KEY, []))
  const [currentDateKey, setCurrentDateKey] = useState(() => todayKey())
  const [dailyData, setDailyData]       = useState(null)
  const [activeTab, setActiveTab]       = useState('pets')
  const [isAddOpen, setIsAddOpen]       = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // ── Load daily data on date change ───────────────────
  useEffect(() => {
    const storageKey = dailyStorageKey(currentDateKey)
    const today      = todayKey()
    const existing   = lsGet(storageKey, null)

    if (existing) {
      setDailyData(existing)
    } else if (currentDateKey === today) {
      const fresh = buildDailySnapshot(petProfiles)
      lsSet(storageKey, fresh)
      setDailyData(fresh)
    } else {
      setDailyData(buildDailySnapshot([]))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDateKey])

  useEffect(() => { lsSet(PETS_KEY, petProfiles) }, [petProfiles])
  useEffect(() => { lsSet(NOTES_KEY, notes) },       [notes])

  // ── Derived ──────────────────────────────────────────
  const petsWithRoutines = applyRoutines(petProfiles, dailyData)

  // ── Pet handlers ─────────────────────────────────────
  const handleAddPet = useCallback((newPet) => {
    const today = todayKey()
    setPetProfiles(prev => {
      const updated = [...prev, newPet]
      lsSet(PETS_KEY, updated)
      const todayKey_ = dailyStorageKey(today)
      const todayData = lsGet(todayKey_, buildDailySnapshot(prev))
      const updatedDaily = {
        ...todayData,
        routines: { ...todayData.routines, [newPet.id]: { ...DEFAULT_ROUTINE } },
      }
      lsSet(todayKey_, updatedDaily)
      if (currentDateKey === today) setDailyData(updatedDaily)
      return updated
    })
  }, [currentDateKey])

  const handleEditPet = useCallback((updatedPet) => {
    setPetProfiles(prev =>
      prev.map(p => p.id === updatedPet.id ? { ...p, ...updatedPet } : p)
    )
  }, [])

  const handleRoutineChange = useCallback((petId, routine) => {
    setDailyData(prev => {
      const updated = { ...prev, routines: { ...prev?.routines, [petId]: routine } }
      lsSet(dailyStorageKey(currentDateKey), updated)
      return updated
    })
  }, [currentDateKey])

  const handleDeletePet = useCallback((petId) => {
    setPetProfiles(prev => prev.filter(p => p.id !== petId))
    setDailyData(prev => {
      if (!prev) return prev
      const { [petId]: _removed, ...rest } = prev.routines || {}
      const updated = { ...prev, routines: rest }
      lsSet(dailyStorageKey(currentDateKey), updated)
      return updated
    })
  }, [currentDateKey])

  // ── Note handlers ─────────────────────────────────────
  const handleAddNote    = useCallback((note)   => setNotes(prev => [...prev, note]), [])
  const handleDeleteNote = useCallback((noteId) => setNotes(prev => prev.filter(n => n.id !== noteId)), [])

  // ── Render ────────────────────────────────────────────
  const hasPets = petProfiles.length > 0

  if (dailyData === null) {
    return (
      <div className="min-h-dvh bg-[#f7f4ef] flex items-center justify-center">
        <p className="text-[#9e8e7e] font-semibold text-sm">Loading Pawket…</p>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#f7f4ef] flex flex-col">
      {/* ── Header ──────────────────────────────────── */}
      {hasPets && (
        <header className="sticky top-0 z-30 bg-[#fdfaf6] border-b-2 border-[#ede8e0]">
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-4">
            {/* Brand */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <PawPrint size={22} className="text-[#c97b4b]" strokeWidth={2.5} />
              <span className="font-black text-[#2d2520] text-xl tracking-tight">Pawket</span>
            </div>

            {/* Tab switcher — soft cream/brown scheme */}
            <nav className="flex gap-1 bg-[#ede8e0] border border-[#d9d0c4] rounded-2xl p-1 mx-auto">
              {TABS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    activeTab === key
                      ? 'bg-white text-[#7a5c38] shadow-sm border border-[#d9c8aa]'
                      : 'text-[#a0907e] hover:text-[#6b4c28] hover:bg-[#e8e0d5]'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.5} />
                  <span>{label}</span>
                  {key === 'notes' && notes.length > 0 && (
                    <span className="bg-[#e07a5f] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-black">
                      {notes.length > 9 ? '9+' : notes.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* History */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-2xl border-2 border-[#ddd5c8] bg-[#f0ebe3] text-[#5c4f3d] text-sm font-bold hover:bg-[#e8e0d5] transition-colors"
              aria-label="Open daily history"
            >
              <CalendarDays size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline">History</span>
            </button>
          </div>
        </header>
      )}

      {/* ── Content ─────────────────────────────────── */}
      <main className="w-full max-w-7xl mx-auto flex-1">
        {!hasPets ? (
          <EmptyState onAddPet={() => setIsAddOpen(true)} />
        ) : activeTab === 'pets' ? (
          <Dashboard
            pets={petsWithRoutines}
            onAddPet={() => setIsAddOpen(true)}
            onEditPet={handleEditPet}
            onRoutineChange={handleRoutineChange}
            onDeletePet={handleDeletePet}
            currentDateKey={currentDateKey}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        ) : (
          <div className="px-5 pt-7 pb-8">
            <NotesSection
              notes={notes}
              onAdd={handleAddNote}
              onDelete={handleDeleteNote}
            />
          </div>
        )}
      </main>

      {/* ── Modals ──────────────────────────────────── */}
      <AddPetModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddPet}
      />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        currentDateKey={currentDateKey}
        onSelectDate={key => { setCurrentDateKey(key); setActiveTab('pets') }}
      />

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="w-full border-t border-[#e8e0d5] bg-[#fdfaf6] py-5 px-5 sm:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <PawPrint size={14} strokeWidth={2.5} className="text-[#c97b4b]" />
            <span className="text-sm font-bold text-[#7a6a58] tracking-tight">Pawket</span>
          </div>
          <p className="text-xs text-[#b0a898] font-medium text-center flex items-center gap-1">
            Made with <Heart size={11} strokeWidth={2.5} className="text-[#e07a5f]" /> for furry babies
          </p>
          <p className="text-xs text-[#c4b9a8] font-medium hidden sm:block">
            Track meals · water · playtime
          </p>
        </div>
      </footer>
    </div>
  )
}
