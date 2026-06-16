import { useState, useEffect, useCallback } from 'react'
import { PawPrint, NotebookPen, CalendarDays, ChevronLeft, Sparkles } from 'lucide-react'
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

function loadDailyData(dateKey, petProfiles) {
  const storageKey = dailyStorageKey(dateKey)
  const today = todayKey()
  const existing = lsGet(storageKey, null)

  if (existing) return existing
  if (dateKey !== today) return buildDailySnapshot([])

  const fresh = buildDailySnapshot(petProfiles)
  lsSet(storageKey, fresh)
  return fresh
}

function applyRoutines(petProfiles, dailyData) {
  const routines = dailyData?.routines || {}
  return petProfiles.map(p => ({
    ...p,
    routine: routines[p.id] ?? { ...DEFAULT_ROUTINE },
  }))
}

// ── Sidebar nav items ─────────────────────────────────────
const NAV_ITEMS = [
  { key: 'welcome', label: 'Welcome', Icon: Sparkles    },
  { key: 'pets',    label: 'My Pets', Icon: PawPrint    },
  { key: 'notes',   label: 'Notes',   Icon: NotebookPen },
]

// ─────────────────────────────────────────────────────────
export default function App() {
  const [petProfiles, setPetProfiles]       = useState(() => lsGet(PETS_KEY, []))
  const [notes, setNotes]                   = useState(() => lsGet(NOTES_KEY, []))
  const [currentDateKey, setCurrentDateKey] = useState(() => todayKey())
  const [dailyData, setDailyData]           = useState(() => loadDailyData(todayKey(), petProfiles))
  const [activeView, setActiveView]         = useState('welcome')
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [isAddOpen, setIsAddOpen]           = useState(false)
  const [isHistoryOpen, setIsHistoryOpen]   = useState(false)

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
      const todayKey_  = dailyStorageKey(today)
      const todayData  = lsGet(todayKey_, buildDailySnapshot(prev))
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
      const rest = { ...(prev.routines || {}) }
      delete rest[petId]
      const updated = { ...prev, routines: rest }
      lsSet(dailyStorageKey(currentDateKey), updated)
      return updated
    })
  }, [currentDateKey])

  // ── Note handlers ─────────────────────────────────────
  const handleAddNote    = useCallback((note)   => setNotes(prev => [...prev, note]), [])
  const handleDeleteNote = useCallback((noteId) => setNotes(prev => prev.filter(n => n.id !== noteId)), [])

  // ── Loading splash ────────────────────────────────────
  if (dailyData === null) {
    return (
      <div className="min-h-dvh bg-[#f7f4ef] flex items-center justify-center">
        <p className="text-[#9e8e7e] font-semibold text-sm">Loading Pawket…</p>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-[#f7f4ef] flex">
      {/* ════════════════════════════════════════════════
          LEFT SIDEBAR - FIXED
      ════════════════════════════════════════════════ */}
      <aside
        className={[
          'hidden sm:fixed sm:left-0 sm:top-0 sm:h-dvh sm:flex sm:flex-col',
          'bg-[#fdfaf6] border-r-2 border-[#ede8e0]',
          'z-20',
          'transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-56' : 'w-[68px]',
        ].join(' ')}
      >
        {/* Brand section */}
        <div 
          className={[
            'flex items-center py-5 border-b border-[#ede8e0]',
            sidebarOpen ? 'px-4' : 'px-0 justify-center',
          ].join(' ')}
        >
          {/* Logo - klik untuk buka sidebar (hanya saat tertutup) */}
          <div
            onClick={() => {
              if (!sidebarOpen) setSidebarOpen(true)
            }}
            className={[
              'flex items-center gap-2.5',
              !sidebarOpen ? 'cursor-pointer hover:opacity-70 transition-opacity' : 'cursor-default',
            ].join(' ')}
          >
            <PawPrint size={22} strokeWidth={2.5} className="text-[#c97b4b] flex-shrink-0" />
            {sidebarOpen && (
              <span className="font-black text-[#2d2520] text-lg tracking-tight">Pawket</span>
            )}
          </div>

          {/* Toggle button - di samping kanan logo, sejajar */}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Collapse sidebar"
              className="ml-auto w-6 h-6 rounded-full bg-[#fdfaf6] border-2 border-[#ede8e0] flex items-center justify-center text-[#9e8e7e] hover:text-[#5c4f3d] hover:bg-[#f0ebe3] transition-all flex-shrink-0"
            >
              <ChevronLeft size={12} strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, Icon }) => {
            const isActive = activeView === key
            const badge    = key === 'notes' && notes.length > 0 ? notes.length : null
            return (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                title={!sidebarOpen ? label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'w-full flex items-center gap-3 py-2.5 rounded-2xl',
                  'text-sm font-bold transition-all duration-150',
                  sidebarOpen ? 'px-3' : 'px-0 justify-center',
                  isActive
                    ? 'bg-[#ede8e0] text-[#7a5c38] border border-[#d9c8aa]'
                    : 'text-[#a0907e] hover:bg-[#f0ebe3] hover:text-[#6b4c28]',
                ].join(' ')}
              >
                <Icon size={18} strokeWidth={2} className="flex-shrink-0" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{label}</span>
                    {badge && (
                      <span className="bg-[#e07a5f] text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-black px-1">
                        {badge > 9 ? '9+' : badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* History shortcut */}
        <div className="px-2 pb-2">
          <button
            onClick={() => setIsHistoryOpen(true)}
            title={!sidebarOpen ? 'History' : undefined}
            className={[
              'w-full flex items-center gap-3 py-2.5 rounded-2xl',
              'text-sm font-bold text-[#a0907e] hover:bg-[#f0ebe3] hover:text-[#6b4c28]',
              'transition-all duration-150',
              sidebarOpen ? 'px-3' : 'px-0 justify-center',
            ].join(' ')}
          >
            <CalendarDays size={18} strokeWidth={2} className="flex-shrink-0" />
            {sidebarOpen && <span>History</span>}
          </button>
        </div>

        {/* Profile slot */}
        <div className={[
          'border-t border-[#ede8e0] p-3 flex items-center gap-3 flex-shrink-0',
          !sidebarOpen ? 'justify-center' : '',
        ].join(' ')}>
          <div className="w-8 h-8 rounded-full bg-[#fde8df] border-2 border-[#f4cbb8] flex items-center justify-center flex-shrink-0">
            <PawPrint size={14} strokeWidth={2.5} className="text-[#c97b4b]" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-[#2d2520] truncate">Pawrents</p>
              <p className="text-[10px] text-[#b0a898] font-medium truncate">
                {petProfiles.length} pet{petProfiles.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ════════════════════════════════════════════════
          RIGHT CONTENT AREA - dengan margin kiri sesuai sidebar
      ════════════════════════════════════════════════ */}
      <div 
        className={[
          'flex-1 flex flex-col min-w-0 min-h-dvh pb-24 sm:pb-0 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'sm:ml-56' : 'sm:ml-[68px]',
        ].join(' ')}
      >
        <main className="flex-1">
          {activeView === 'welcome' && (
            <EmptyState
              onAddPet={() => {
                setIsAddOpen(true)
                setActiveView('pets')
              }}
            />
          )}

          {activeView === 'pets' && (
            <Dashboard
              pets={petsWithRoutines}
              onAddPet={() => setIsAddOpen(true)}
              onEditPet={handleEditPet}
              onRoutineChange={handleRoutineChange}
              onDeletePet={handleDeletePet}
              currentDateKey={currentDateKey}
            />
          )}

          {activeView === 'notes' && (
            <div className="px-4 sm:px-8 pt-5 sm:pt-7 pb-8">
              <NotesSection
                notes={notes}
                onAdd={handleAddNote}
                onDelete={handleDeleteNote}
              />
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-[#ede8e0] bg-[#fdfaf6]/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2 shadow-[0_-8px_24px_rgba(61,53,48,0.08)] backdrop-blur sm:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {NAV_ITEMS.map(({ key, label, Icon }) => {
            const isActive = activeView === key
            const badge = key === 'notes' && notes.length > 0 ? notes.length : null
            return (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-extrabold transition-colors',
                  isActive
                    ? 'bg-[#ede8e0] text-[#7a5c38]'
                    : 'text-[#a0907e] hover:bg-[#f0ebe3] hover:text-[#6b4c28]',
                ].join(' ')}
              >
                <Icon size={19} strokeWidth={2.4} />
                <span className="max-w-full truncate">{label}</span>
                {badge && (
                  <span className="absolute right-3 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#e07a5f] px-1 text-[9px] font-black text-white">
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </button>
            )
          })}

          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-extrabold text-[#a0907e] transition-colors hover:bg-[#f0ebe3] hover:text-[#6b4c28]"
          >
            <CalendarDays size={19} strokeWidth={2.4} />
            <span className="max-w-full truncate">History</span>
          </button>
        </div>
      </nav>

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
        onSelectDate={key => {
          setCurrentDateKey(key)
          setDailyData(loadDailyData(key, petProfiles))
          setActiveView('pets')
        }}
      />
    </div>
  )
}
