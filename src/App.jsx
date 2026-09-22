import { useState, useEffect, useCallback } from "react";
import { CalendarDays, UserRound, ChevronDown } from "lucide-react";
import { todayKey, formatDateKey } from "./utils/dateUtils";
import pawketIcon from "./assets/pawket.png";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import ProfilePage from "./components/ProfilePage";
import AddPetModal from "./components/AddPetModal";
import HistoryModal from "./components/HistoryModal";
import { supabase } from "./lib/supabase";
import { usePets } from "./hooks/usePets";
import { useNotes } from "./hooks/useNotes";
import { useRoutines } from "./hooks/useRoutines";

// ─────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentDateKey, setCurrentDateKey] = useState(() => todayKey());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // ── Auth ─────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(mapUser(session.user));
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapUser(session.user) : null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  function mapUser(u) {
    return {
      id:    u.id,
      name:  u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Pawrents",
      email: u.email,
      avatar_url: u.user_metadata?.avatar_url || null,
    };
  }

  // ── Data hooks ───────────────────────────────────────
  const { pets, loading: petsLoading, addPet, editPet, deletePet } = usePets(user?.id);
  const { notes, loading: notesLoading, addNote, deleteNote } = useNotes(user?.id);

  const petIds = pets.map((p) => p.id);
  const { routines, loading: routinesLoading, updateRoutine } = useRoutines(user?.id, petIds, currentDateKey);

  // ── Merge routines into pets ─────────────────────────
  const petsWithRoutines = pets.map((p) => ({
    ...p,
    routine: routines[p.id] ?? {},
  }));

  // ── Derived stats ────────────────────────────────────
  const routineKeys = ["meal_morning", "meal_noon", "meal_night", "water_refill", "activity_playtime", "activity_clean"];
  const routinesPending = petsWithRoutines.reduce(
    (total, pet) => total + routineKeys.filter((key) => !pet.routine?.[key]).length,
    0
  );
  const todaysNotesCount = notes.filter((note) => {
    const noteDate = new Date(note.created_at);
    const today = new Date();
    return (
      noteDate.getFullYear() === today.getFullYear() &&
      noteDate.getMonth() === today.getMonth() &&
      noteDate.getDate() === today.getDate()
    );
  }).length;

  // ── Pet handlers ─────────────────────────────────────
  const handleAddPet = useCallback(async (newPet) => {
    await addPet(newPet);
  }, [addPet]);

  const handleEditPet = useCallback(async (updatedPet) => {
    await editPet(updatedPet);
  }, [editPet]);

  const handleDeletePet = useCallback(async (petId) => {
    await deletePet(petId);
  }, [deletePet]);

  const handleRoutineChange = useCallback(async (petId, routine) => {
    await updateRoutine(petId, routine);
  }, [updateRoutine]);

  // ── Note handlers ────────────────────────────────────
  const handleAddNote = useCallback(async (note) => {
    await addNote(note);
  }, [addNote]);

  const handleDeleteNote = useCallback(async (noteId) => {
    await deleteNote(noteId);
  }, [deleteNote]);

  // ── Logout ───────────────────────────────────────────
  const handleLogout = async () => {
    setCurrentPage("dashboard");
    await supabase.auth.signOut();
  };

  // ── Loading state ────────────────────────────────────
  const dataLoading = petsLoading || notesLoading || routinesLoading;

  if (authLoading) {
    return (
      <div className="min-h-dvh bg-[#f7f4ef] flex items-center justify-center">
        <p className="text-[#9e8e7e] font-semibold text-sm">Loading Pawket…</p>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  if (dataLoading) {
    return (
      <div className="min-h-dvh bg-[#f7f4ef] flex items-center justify-center">
        <p className="text-[#9e8e7e] font-semibold text-sm">Loading your data…</p>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────
  return (
    <div className="flex min-h-dvh flex-col bg-[#f7f4ef]">
      <header className="sticky top-0 z-30 border-b-2 border-[#ede8e0] bg-[#fdfaf6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-0">
          <button
            type="button"
            onClick={() => setCurrentPage("dashboard")}
            className="flex items-center gap-2.5 rounded-2xl px-1 py-1"
          >
            <img src={pawketIcon} alt="Pawket" className="h-10 w-10 object-contain" />
            <span className="text-lg font-black tracking-tight text-[#2d2520]">Pawket</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex min-w-0 items-center gap-2 rounded-2xl border-2 border-[#ede8e0] bg-white px-2.5 py-2">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[#b0a898] transition-colors hover:bg-[#f5f2ed] hover:text-[#7a5c38]"
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
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="h-8 w-8 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fde8df] text-[#c97b4b]">
                    <UserRound size={16} strokeWidth={2.5} />
                  </div>
                )}
                <div className="hidden min-w-0 sm:block">
                  <p className="max-w-28 truncate text-xs font-extrabold text-[#2d2520]">
                    {user.name}
                  </p>
                </div>
                <ChevronDown size={16} strokeWidth={2.5} className="hidden text-[#8a7968] sm:block" />
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

      <footer className="hidden border-t border-[#ede8e0] bg-[#fdfaf6] sm:block">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-[#9e8e7e] sm:flex-row sm:items-center sm:justify-between sm:px-0">
          <div className="flex items-center gap-2">
            <img src={pawketIcon} alt="Pawket" className="h-5 w-5 object-contain" />
            <span className="font-bold text-[#2d2520]">Pawket</span>
            <span className="hidden sm:inline">Daily care, neatly kept.</span>
          </div>
          <span>{new Date().getFullYear()} Pawket</span>
        </div>
      </footer>

      {/* ── Modals ── */}
      <AddPetModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAddPet}
      />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        currentDateKey={currentDateKey}
        onSelectDate={(key) => setCurrentDateKey(key)}
      />
    </div>
  );
}
