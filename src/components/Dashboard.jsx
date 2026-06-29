import { useEffect, useState } from "react";
import {
  Plus,
  Cat,
  Shapes,
  CalendarDays,
  NotebookPen,
  X,
  ClipboardList,
  PawPrint,
  StickyNote,
  ClipboardCheck,
  Bed,
  House,
  UserRound,
} from "lucide-react";
import PetCard from "./PetCard";
import PetDetailModal from "./PetDetailModal";
import EditPetModal from "./EditPetModal";
import { todayKey, formatDateLabel } from "../utils/dateUtils";
import AddNoteModal from "./AddNoteModal";
import dogPawImage from "../assets/dog-paw.png";

// ── Decorative paw SVG (copy dari AuthPage) ──
function PawDecor({ size = 48, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="32" cy="42" rx="14" ry="12" fill="currentColor" />
      <ellipse cx="18" cy="28" rx="6" ry="7" fill="currentColor" />
      <ellipse cx="31" cy="23" rx="6" ry="7" fill="currentColor" />
      <ellipse cx="44" cy="26" rx="6" ry="7" fill="currentColor" />
      <ellipse cx="54" cy="35" rx="5" ry="6" fill="currentColor" />
    </svg>
  );
}

// ── Generate paw positions (sama seperti di AuthPage) ──
const generatePawPositions = () => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const positions = [];

  const cols = isMobile ? 5 : 8;
  const rows = isMobile ? 5 : 7;
  const total = cols * rows;

  for (let i = 0; i < total; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);

    const offsetX = (Math.random() - 0.5) * 0.4;
    const offsetY = (Math.random() - 0.5) * 0.4;

    let top = ((row + 0.5) / rows + offsetY / rows) * 100;
    let left = ((col + 0.5) / cols + offsetX / cols) * 100;

    top = Math.max(3, Math.min(97, top));
    left = Math.max(3, Math.min(97, left));

    const size = isMobile
      ? 22 + Math.floor(Math.random() * 20)
      : 30 + Math.floor(Math.random() * 28);

    positions.push({
      size,
      top,
      left,
      rotate: `${(Math.random() - 0.5) * 60}deg`,
      opacity: 0.08 + Math.random() * 0.12,
    });
  }

  return positions;
};

// ── Simpan di localStorage biar permanen ──
const getPawPositions = () => {
  const STORAGE_KEY = "pawket_dashboard_paw_positions";

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  const positions = generatePawPositions();

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch {
      return positions;
    }
  }

  return positions;
};

const INITIAL_PAW_POSITIONS = getPawPositions();

// ── Custom Hamster Icon ──
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
);

const FILTERS = [
  { key: "All", label: "All", Icon: Shapes },
  { key: "Cat", label: "Cats", Icon: Cat },
  { key: "Hamster", label: "Hamsters", Icon: HamsterIcon },
];

const MOBILE_NAV_ITEMS = [
  { id: "home", label: "Home", Icon: House },
  { id: "pets", label: "Pets", Icon: PawPrint },
  { id: "notes", label: "Notes", Icon: NotebookPen },
  { id: "me", label: "Me", Icon: UserRound },
];

function HeroPetIllustration() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <img
        src={dogPawImage}
        alt=""
        aria-hidden="true"
        className="h-40 w-40 object-contain drop-shadow-sm"
      />
    </div>
  );
}

function StatCard({ Icon, value, label, helper, tone, imageSrc }) {
  const toneClass = {
    peach: "bg-[#fde8df] text-[#c97b4b]",
    gold: "bg-[#fff0cc] text-[#c99a2e]",
    green: "bg-[#e3f1d8] text-[#6e9b55]",
  }[tone];

  return (
    <div className="rounded-2xl border border-[#ece1d6] bg-white/75 p-3 sm:p-4">
      <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl sm:h-10 sm:w-10 ${toneClass}`}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={label}
              className="h-6 w-6 object-contain sm:h-7 sm:w-7"
            />
          ) : (
            <Icon size={17} strokeWidth={2.4} />
          )}
        </span>
        <div>
          <p className="text-2xl font-black leading-none text-[#2d2520] sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#2d2520] sm:text-xs sm:normal-case sm:tracking-normal">
            {label}
          </p>
        </div>
      </div>
      <p className="mt-4 hidden text-xs font-medium text-[#9e8e7e] sm:block">
        {helper}
      </p>
    </div>
  );
}

export default function Dashboard({
  pets,
  onAddPet,
  onRoutineChange,
  onDeletePet,
  onEditPet,
  currentDateKey,
  user,
  notes = [],
  onAddNote,
  onDeleteNote,
  onOpenProfile,
}) {
  const [filter, setFilter] = useState("All");
  const [detailPet, setDetailPet] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const isReadOnly = currentDateKey !== todayKey();
  const filtered =
    filter === "All" ? pets : pets.filter((p) => p.type === filter);

  const counts = { All: pets.length, Cat: 0, Hamster: 0 };
  pets.forEach((p) => {
    if (counts[p.type] !== undefined) counts[p.type]++;
  });

  const dateLabel = formatDateLabel(currentDateKey, true);
  const routineKeys = [
    "meal_morning",
    "meal_noon",
    "meal_night",
    "water_refill",
    "activity_playtime",
    "activity_clean",
  ];
  const routinesPending = pets.reduce(
    (total, pet) =>
      total + routineKeys.filter((key) => !pet.routine?.[key]).length,
    0,
  );
  const todaysNotes = notes.filter((note) => {
    const noteDate = new Date(note.createdAt);
    const today = new Date();
    return (
      noteDate.getFullYear() === today.getFullYear() &&
      noteDate.getMonth() === today.getMonth() &&
      noteDate.getDate() === today.getDate()
    );
  });

  function handleAddNote(text) {
    if (!text || !onAddNote) return;
    onAddNote({
      id: crypto.randomUUID(),
      text,
      petName: "General",
      createdAt: Date.now(),
    });
  }

  useEffect(() => {
    const sections = MOBILE_NAV_ITEMS.map(({ id }) =>
      document.getElementById(id),
    ).filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-20% 0px -55% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function handleMobileNavClick(sectionId) {
    if (sectionId === "me") {
      onOpenProfile?.();
      return;
    }

    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const pawPositions = INITIAL_PAW_POSITIONS;

  return (
    <div className="relative min-h-full overflow-hidden bg-[#faf7f2] pb-28 sm:pb-12">
      {/* ── Background paw prints ── */}
      <div
        className="pointer-events-none select-none absolute inset-0 overflow-visible"
        aria-hidden="true"
      >
        {pawPositions.map((p, i) => (
          <div
            key={`dash-paw-${i}`}
            className="absolute text-[#d9c8aa]"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              transform: `translate(-50%, -50%) rotate(${p.rotate})`,
              opacity: p.opacity,
            }}
          >
            <PawDecor size={p.size} />
          </div>
        ))}
      </div>

      <div className="relative z-10 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          {/* ── Top Section: Summary + Notes ── */}
          <div className="py-6 lg:py-8">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
              {/* Left Card - Full height */}
              <section
                id="home"
                className="scroll-mt-24 relative overflow-hidden rounded-[1.5rem] border border-[#e3d8cc] bg-white/80 p-4 shadow-sm backdrop-blur-sm sm:p-5 md:grid md:grid-cols-[180px_1fr] md:gap-6 md:p-5 lg:p-6"
              >
                <div className="hidden items-end justify-center md:flex">
                  <HeroPetIllustration />
                </div>

                <div className="relative z-10">
                  <h1 className="text-2xl font-black tracking-tight text-[#2d2520] sm:text-3xl">
                    Hello, {user?.name || "Pawrents"}
                  </h1>

                  <p className="mt-2 text-sm font-bold text-[#9e8e7e]">
                    Here's what's happening with your pets today.
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4">
                    <CalendarDays
                      size={15}
                      strokeWidth={2.2}
                      className="text-[#9e8e7e]"
                    />
                    <span className="text-sm font-semibold text-[#8a7968]">
                      {dateLabel}
                    </span>
                    {isReadOnly && (
                      <span className="rounded-full border border-[#f5e5a0] bg-[#fef9e7] px-2 py-0.5 text-xs font-bold text-[#78610a]">
                        view only
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
                    <StatCard
                      Icon={PawPrint}
                      value={pets.length}
                      label="Total Pets"
                      helper="All your furry friends"
                      tone="peach"
                    />
                    <StatCard
                      Icon={StickyNote}
                      value={todaysNotes.length}
                      label="Notes Today"
                      helper="Notes to check"
                      tone="gold"
                    />
                    <StatCard
                      Icon={ClipboardCheck}
                      value={routinesPending}
                      label="Routines Pending"
                      helper="Need your attention"
                      tone="green"
                    />
                  </div>
                </div>
              </section>

              {/* ── Right Card - Today's Notes ── */}
              <div
                id="notes"
                className="scroll-mt-24 rounded-[1.25rem] border border-[#e3d8cc] bg-white/80 p-5 shadow-sm backdrop-blur-sm flex min-h-[320px] h-[320px] flex-col lg:p-6"
              >
                <div className="mb-3 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-lg font-black text-[#2d2520]">
                    Today's Notes
                  </h2>
                  <button
                    onClick={() => setIsNoteModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-2xl border border-[#e9b6a7] px-3 py-1.5 text-sm font-extrabold text-[#e07a5f] transition-colors hover:bg-[#fde8df] flex-shrink-0"
                  >
                    <Plus size={14} strokeWidth={3} />
                    Add Note
                  </button>
                </div>

                <div className="border-t border-[#ede8e0] mb-3" />

                <div className="flex-1 min-h-0 overflow-y-auto">
                  {todaysNotes.length === 0 ? (
                    <div className="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
                      <ClipboardList
                        size={48}
                        strokeWidth={1.2}
                        className="mb-3 text-[#ead8cd]"
                      />
                      <p className="text-sm font-black text-[#2d2520]">
                        No notes for today
                      </p>
                      <p className="mt-1 max-w-xs text-xs font-medium leading-relaxed text-[#9e8e7e]">
                        Click "Add Note" to write something important.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {todaysNotes.map((note) => (
                        <div
                          key={note.id}
                          className="group flex items-start gap-2 rounded-xl border border-[#eee4db] bg-[#fdfaf6] p-2.5"
                        >
                          <NotebookPen
                            size={14}
                            strokeWidth={2.2}
                            className="mt-0.5 flex-shrink-0 text-[#e07a5f]"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="break-words text-sm font-semibold leading-relaxed text-[#5c4f3d] line-clamp-2">
                              {note.text}
                            </p>
                            <p className="mt-0.5 text-[10px] font-bold text-[#b0a898]">
                              {note.petName || "General"}
                            </p>
                          </div>
                          {onDeleteNote && (
                            <button
                              onClick={() => onDeleteNote(note.id)}
                              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-[#b0a898] hover:bg-[#fde8df] hover:text-[#e07a5f]"
                              aria-label="Delete note"
                            >
                              <X size={12} strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Pets Section (WRAPPED IN CARD) ── */}
          <section id="pets" className="scroll-mt-24 pb-8">
            <div className="rounded-[1.25rem] border border-[#e3d8cc] bg-white/80 backdrop-blur-sm p-5 shadow-sm lg:p-6">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-xl font-black text-[#2d2520]">
                  Your Beloved Babies
                </h2>
                {!isReadOnly && (
                  <button
                    onClick={onAddPet}
                    className="flex flex-shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-2xl border border-[#e9b6a7] bg-white px-3 py-1.5 text-sm font-extrabold text-[#e07a5f] transition-colors hover:bg-[#fde8df] active:scale-95"
                    aria-label="Add a new pet"
                  >
                    <Plus size={14} strokeWidth={3} />
                    <span>Add Pet</span>
                  </button>
                )}
              </div>

              {/* Garis pembatas */}
              <div className="border-t border-[#ede8e0] mb-4" />

              {/* Filter tabs */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
                  {FILTERS.map(({ key, label, Icon }) => {
                    const active = filter === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setFilter(key)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold border transition-colors ${
                          active
                            ? "bg-[#ede8e0] border-[#d9c8aa] text-[#7a5c38]"
                            : "bg-white border-[#ddd5c8] text-[#8a7968] hover:border-[#c4b9a8] hover:bg-[#f5f2ed]"
                        }`}
                      >
                        <Icon size={14} strokeWidth={2.5} />
                        {label}
                        <span
                          className={`text-xs font-extrabold px-1.5 py-0.5 rounded-full ${
                            active
                              ? "bg-[#d9c8aa] text-[#7a5c38]"
                              : "bg-[#f0ebe3] text-[#7a6a58]"
                          }`}
                        >
                          {counts[key]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pet Cards */}
              <div className="pt-4">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-[#b0a898]">
                    <Bed
                      size={40}
                      className="mx-auto mb-3 opacity-40"
                      strokeWidth={1.5}
                    />
                    <p className="text-sm font-semibold">
                      No{" "}
                      {filter === "All" ? "pets" : filter.toLowerCase() + "s"}{" "}
                      found.
                    </p>
                    {filter !== "All" && (
                      <button
                        onClick={() => setFilter("All")}
                        className="mt-3 text-[#e07a5f] text-sm font-bold"
                      >
                        Show all pets
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((pet) => (
                      <PetCard
                        key={pet.id}
                        pet={pet}
                        onClick={() => setDetailPet(pet)}
                        onEdit={(p) => setEditingPet(p)}
                        isReadOnly={isReadOnly}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-3 sm:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-[2rem] border border-[#f1ebe4] bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(69,39,23,0.08)] backdrop-blur">
          {MOBILE_NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => handleMobileNavClick(id)}
                className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors ${
                  isActive
                    ? "text-[#c95f38]"
                    : "text-[#9f9588] hover:text-[#7a5c38]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={22} strokeWidth={2.4} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Modals ── */}
      <PetDetailModal
        pet={detailPet}
        isOpen={!!detailPet}
        onClose={() => setDetailPet(null)}
        isReadOnly={isReadOnly}
        onRoutineChange={(petId, routine) => {
          onRoutineChange(petId, routine);
          setDetailPet((prev) => (prev ? { ...prev, routine } : null));
        }}
        onDelete={onDeletePet}
      />

      <EditPetModal
        pet={editingPet}
        isOpen={!!editingPet}
        onClose={() => setEditingPet(null)}
        onSave={(updated) => {
          onEditPet(updated);
          setEditingPet(null);
        }}
      />

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onAdd={handleAddNote}
      />
    </div>
  );
}
