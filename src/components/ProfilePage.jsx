import {
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Mail,
  LogOut,
  PawPrint,
  StickyNote,
  UserRound,
} from "lucide-react";

export default function ProfilePage({
  user,
  petCount,
  todaysNotesCount,
  routinesPending,
  onBack,
  onOpenHistory,
  onLogout,
}) {
  return (
    <div className="min-h-full bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-2xl border border-[#ddd5c8] bg-white px-4 py-2.5 text-sm font-extrabold text-[#7a5c38] transition-colors hover:bg-[#f5f2ed]"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to dashboard
          </button>
        </div>

        <section className="overflow-hidden rounded-[1.75rem] border border-[#e3d8cc] bg-white/85 p-5 shadow-sm backdrop-blur-sm sm:p-6 lg:p-7">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:items-stretch">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[#fde8df] text-[#c97b4b] sm:h-20 sm:w-20">
                  <UserRound size={34} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b0a898]">
                    User Profile
                  </p>
                  <h1 className="truncate text-2xl font-black tracking-tight text-[#2d2520] sm:text-3xl">
                    {user?.name || "Pawrents"}
                  </h1>
                  <div className="mt-2 inline-flex max-w-full items-center gap-2 rounded-full bg-[#f5f2ed] px-3 py-1 text-sm font-semibold text-[#8a7968]">
                    <Mail size={14} strokeWidth={2.5} className="flex-shrink-0" />
                    <span className="truncate">{user?.email || "No email saved"}</span>
                  </div>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-sm font-medium leading-relaxed text-[#8a7968] sm:text-base">
                Keep track of your Pawket account and get a quick overview of your pets,
                notes, and routines from one place.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#ece1d6] bg-[#fdfaf6] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fde8df] text-[#c97b4b]">
                    <PawPrint size={20} strokeWidth={2.4} />
                  </div>
                  <p className="mt-4 text-2xl font-black text-[#2d2520]">{petCount}</p>
                  <p className="mt-1 text-sm font-bold text-[#8a7968]">Pets registered</p>
                </div>

                <div className="rounded-2xl border border-[#ece1d6] bg-[#fdfaf6] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0cc] text-[#c99a2e]">
                    <StickyNote size={20} strokeWidth={2.4} />
                  </div>
                  <p className="mt-4 text-2xl font-black text-[#2d2520]">{todaysNotesCount}</p>
                  <p className="mt-1 text-sm font-bold text-[#8a7968]">Notes today</p>
                </div>

                <div className="rounded-2xl border border-[#ece1d6] bg-[#fdfaf6] p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e3f1d8] text-[#6e9b55]">
                    <ClipboardCheck size={20} strokeWidth={2.4} />
                  </div>
                  <p className="mt-4 text-2xl font-black text-[#2d2520]">{routinesPending}</p>
                  <p className="mt-1 text-sm font-bold text-[#8a7968]">Routines pending</p>
                </div>
              </div>
            </div>

            <aside className="rounded-[1.5rem] border border-[#ece1d6] bg-[#fdfaf6] p-5">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#b0a898]">
                Quick Actions
              </p>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#ddd5c8] bg-white px-4 py-3 text-sm font-extrabold text-[#7a5c38] transition-colors hover:bg-[#f5f2ed]"
                >
                  <CalendarDays size={16} strokeWidth={2.4} />
                  Open history
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#ddd5c8] bg-white px-4 py-3 text-sm font-extrabold text-[#7a5c38] transition-colors hover:bg-[#f5f2ed]"
                >
                  <ArrowLeft size={16} strokeWidth={2.4} />
                  Go to dashboard
                </button>

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#2d2520] px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#473b33]"
                >
                  <LogOut size={16} strokeWidth={2.4} />
                  Log out
                </button>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}
