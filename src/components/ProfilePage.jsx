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
  const stats = [
    {
      label: "Pets",
      value: petCount,
      icon: PawPrint,
      iconClassName: "bg-[#fde8df] text-[#c97b4b]",
    },
    {
      label: "Notes today",
      value: todaysNotesCount,
      icon: StickyNote,
      iconClassName: "bg-[#fff0cc] text-[#c99a2e]",
    },
    {
      label: "Pending routines",
      value: routinesPending,
      icon: ClipboardCheck,
      iconClassName: "bg-[#e3f1d8] text-[#6e9b55]",
    },
  ];

  return (
    <div className="bg-[#faf7f2] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-2 rounded-2xl border border-[#ddd5c8] bg-white px-4 py-2.5 text-sm font-bold text-[#7a5c38] transition-colors hover:bg-[#f5f2ed]"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to dashboard
        </button>

        <section className="rounded-[1.5rem] border border-[#e3d8cc] bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fde8df] text-[#c97b4b]">
                  <UserRound size={28} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#9e8e7e]">Profile</p>
                  <h1 className="truncate text-2xl font-black tracking-tight text-[#2d2520]">
                    {user?.name || "Pawrents"}
                  </h1>
                  <div className="mt-1 flex max-w-full items-center gap-2 text-sm text-[#8a7968]">
                    <Mail size={14} strokeWidth={2.4} className="shrink-0" />
                    <span className="truncate">
                      {user?.email || "No email saved"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-2 sm:min-w-[220px]">
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#ddd5c8] bg-white px-4 py-3 text-sm font-bold text-[#7a5c38] transition-colors hover:bg-[#f5f2ed]"
                >
                  <CalendarDays size={16} strokeWidth={2.4} />
                  Open history
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#2d2520] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#473b33]"
                >
                  <LogOut size={16} strokeWidth={2.4} />
                  Log out
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {stats.map(({ label, value, icon: Icon, iconClassName }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-[#ece1d6] bg-[#fdfaf6] p-4"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClassName}`}
                  >
                    <Icon size={18} strokeWidth={2.4} />
                  </div>
                  <p className="mt-3 text-2xl font-black text-[#2d2520]">
                    {value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#8a7968]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
