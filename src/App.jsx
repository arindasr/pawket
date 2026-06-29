import { useState, useEffect, useCallback } from "react";
import { CalendarDays, UserRound, ChevronDown } from "lucide-react";
import {
  todayKey,
  dailyStorageKey,
  PETS_KEY,
  NOTES_KEY,
  DEFAULT_ROUTINE,
} from "./utils/dateUtils";
import pawketIcon from "./assets/pawket.png";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import AddPetModal from "./components/AddPetModal";
import HistoryModal from "./components/HistoryModal";

// ── localStorage helpers ──────────────────────────────────
function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage write failed:", e);
  }
}

function buildDailySnapshot(petProfiles) {
  const routines = {};
  petProfiles.forEach((p) => {
    routines[p.id] = { ...DEFAULT_ROUTINE };
  });
  return { routines };
}

function loadDailyData(dateKey, petProfiles) {
  const storageKey = dailyStorageKey(dateKey);
  const today = todayKey();
  const existing = lsGet(storageKey, null);

  if (existing) return existing;
  if (dateKey !== today) return buildDailySnapshot([]);

  const fresh = buildDailySnapshot(petProfiles);
  lsSet(storageKey, fresh);
  return fresh;
}

function applyRoutines(petProfiles, dailyData) {
  const routines = dailyData?.routines || {};
  return petProfiles.map((p) => ({
    ...p,
    routine: routines[p.id] ?? { ...DEFAULT_ROUTINE },
  }));
}

const AUTH_KEY = "pawket_user";

// ─────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => lsGet(AUTH_KEY, null));
  const [petProfiles, setPetProfiles] = useState(() => lsGet(PETS_KEY, []));
  const [notes, setNotes] = useState(() => lsGet(NOTES_KEY, []));
  const [currentDateKey, setCurrentDateKey] = useState(() => todayKey());
  const [dailyData, setDailyData] = useState(() =>
    loadDailyData(todayKey(), petProfiles),
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    user ? lsSet(AUTH_KEY, user) : localStorage.removeItem(AUTH_KEY);
  }, [user]);
  useEffect(() => {
    lsSet(PETS_KEY, petProfiles);
  }, [petProfiles]);
  useEffect(() => {
    lsSet(NOTES_KEY, notes);
  }, [notes]);

  // ── Derived ──────────────────────────────────────────
  const petsWithRoutines = applyRoutines(petProfiles, dailyData);
  const routineKeys = [
    "meal_morning",
    "meal_noon",
    "meal_night",
    "water_refill",
    "activity_playtime",
    "activity_clean",
  ];
  const routinesPending = petsWithRoutines.reduce(
    (total, pet) =>
      total + routineKeys.filter((key) => !pet.routine?.[key]).length,
    0,
  );
  const todaysNotesCount = notes.filter((note) => {
    const noteDate = new Date(note.createdAt);
    const today = new Date();
    return (
      noteDate.getFullYear() === today.getFullYear() &&
      noteDate.getMonth() === today.getMonth() &&
      noteDate.getDate() === today.getDate()
    );
  }).length;

  // ── Pet handlers ─────────────────────────────────────
  const handleAddPet = useCallback(
    (newPet) => {
      const today = todayKey();
      setPetProfiles((prev) => {
        const updated = [...prev, newPet];
        lsSet(PETS_KEY, updated);
        const todayKey_ = dailyStorageKey(today);
        const todayData = lsGet(todayKey_, buildDailySnapshot(prev));
        const updatedDaily = {
          ...todayData,
          routines: {
            ...todayData.routines,
            [newPet.id]: { ...DEFAULT_ROUTINE },
          },
        };
        lsSet(todayKey_, updatedDaily);
        if (currentDateKey === today) setDailyData(updatedDaily);
        return updated;
      });
    },
    [currentDateKey],
  );

  const handleEditPet = useCallback((updatedPet) => {
    setPetProfiles((prev) =>
      prev.map((p) => (p.id === updatedPet.id ? { ...p, ...updatedPet } : p)),
    );
  }, []);

  const handleRoutineChange = useCallback(
    (petId, routine) => {
      setDailyData((prev) => {
        const updated = {
          ...prev,
          routines: { ...prev?.routines, [petId]: routine },
        };
        lsSet(dailyStorageKey(currentDateKey), updated);
        return updated;
      });
    },
    [currentDateKey],
  );

  const handleDeletePet = useCallback(
    (petId) => {
      setPetProfiles((prev) => prev.filter((p) => p.id !== petId));
      setDailyData((prev) => {
        if (!prev) return prev;
        const rest = { ...(prev.routines || {}) };
        delete rest[petId];
        const updated = { ...prev, routines: rest };
        lsSet(dailyStorageKey(currentDateKey), updated);
        return updated;
      });
    },
    [currentDateKey],
  );

  // ── Note handlers ─────────────────────────────────────
  const handleAddNote = useCallback(
    (note) => setNotes((prev) => [...prev, note]),
    [],
  );
  const handleDeleteNote = useCallback(
    (noteId) => setNotes((prev) => prev.filter((n) => n.id !== noteId)),
    [],
  );

  // ── Loading splash ────────────────────────────────────
  if (dailyData === null) {
    return (
      <div className="min-h-dvh bg-[#f7f4ef] flex items-center justify-center">
        <p className="text-[#9e8e7e] font-semibold text-sm">Loading Pawket…</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuth={setUser} />;
  }

  const handleLogout = () => {
    setCurrentPage("dashboard");
    setUser(null);
  };

  // ── Render ────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-[#f7f4ef]">
      <header className="sticky top-0 z-30 border-b-2 border-[#ede8e0] bg-[#fdfaf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-0">
          <button
            type="button"
            onClick={() => setCurrentPage("dashboard")}
            className="flex items-center gap-2.5 rounded-2xl px-1 py-1"
          >
            <img
              src={pawketIcon}
              alt="Pawket"
              className="h-10 w-10 object-contain"
            />
            <span className="text-lg font-black tracking-tight text-[#2d2520]">
              Pawket
            </span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-2 rounded-2xl border-2 border-[#ede8e0] bg-white px-2.5 py-2">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-[#b0a898] transition-colors hover:bg-[#f5f2ed] hover:text-[#7a5c38]"
                aria-label="History"
              >
                <CalendarDays size={16} strokeWidth={2.5} />
              </button>
              <div className="hidden h-6 w-px bg-[#ede8e0] sm:block" />
              <button
                type="button"
                onClick={() => setCurrentPage("profile")}
                className="hidden min-w-0 items-center gap-2 rounded-xl px-1 py-1 transition-colors hover:bg-[#f5f2ed] sm:flex"
                aria-label="Open profile"
                aria-current={currentPage === "profile" ? "page" : undefined}
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#fde8df] text-[#c97b4b]">
                  <UserRound size={16} strokeWidth={2.5} />
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="max-w-28 truncate text-xs font-extrabold text-[#2d2520]">
                    {user.name}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className="hidden text-[#8a7968] sm:block"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="dashboard">
          {currentPage === "profile" ? (
            <ProfilePage
              user={user}
              petCount={petsWithRoutines.length}
              todaysNotesCount={todaysNotesCount}
              routinesPending={routinesPending}
              onBack={() => setCurrentPage("dashboard")}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onLogout={handleLogout}
            />
          ) : (
            <Dashboard
              pets={petsWithRoutines}
              onAddPet={() => setIsAddOpen(true)}
              onEditPet={handleEditPet}
              onRoutineChange={handleRoutineChange}
              onDeletePet={handleDeletePet}
              currentDateKey={currentDateKey}
              user={user}
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onLogout={handleLogout}
              onOpenProfile={() => setCurrentPage("profile")}
            />
          )}
        </section>
      </main>

      <footer className="hidden border-t-2 border-[#ede8e0] bg-[#fdfaf6] px-4 pt-6 pb-28 sm:block sm:px-8 sm:py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-medium text-[#9e8e7e] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <img
              src={pawketIcon}
              alt="Pawket"
              className="h-5 w-5 object-contain"
            />
            <span className="font-extrabold text-[#2d2520]">Pawket</span>
            <span>Daily care, neatly kept.</span>
          </div>
          <span>
            {new Date().getFullYear()} Pawket. Made for thoughtful pawrents.
          </span>
        </div>
      </footer>

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
        onSelectDate={(key) => {
          setCurrentDateKey(key);
          setDailyData(loadDailyData(key, petProfiles));
        }}
      />
    </div>
  );
}
