import { useState } from "react";
import { LogIn, UserPlus, Mail, Lock, UserRound } from "lucide-react";
import petImage from "../assets/pet.png";

// ── Decorative paw SVG ──
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

// ── Illustration: cat + dog using image ──
function PetIllustration() {
  return (
    <div className="flex justify-center items-center">
      <img
        src={petImage}
        alt="A cat and dog playing together"
        className="w-full max-w-85 drop-shadow-sm"
        loading="lazy"
      />
    </div>
  );
}

// ── Generate evenly distributed paw prints for desktop/tablet ──
const generatePawPositions = () => {
  const positions = [];
  const cols = 8;
  const rows = 7;
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

    positions.push({
      size: 30 + Math.floor(Math.random() * 28),
      top,
      left,
      rotate: `${(Math.random() - 0.5) * 60}deg`,
      opacity: 0.2 + Math.random() * 0.25,
    });
  }

  return positions;
};

// ── Get or generate paw positions (permanent via localStorage) ──
const getPawPositions = () => {
  const STORAGE_KEY = "pawket_paw_positions_desktop";

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // kalau corrupt, generate ulang
      }
    }
  }

  const positions = generatePawPositions();

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch {
      // ignore
    }
  }

  return positions;
};

const INITIAL_PAW_POSITIONS = getPawPositions();

// ─────────────────────────────────────────────────────────
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pawPositions = INITIAL_PAW_POSITIONS;
  const isRegister = mode === "register";

  function handleSubmit(e) {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) return;
    onAuth({
      name: isRegister
        ? name.trim() || "Pawrents"
        : cleanEmail.split("@")[0] || "Pawrents",
      email: cleanEmail,
    });
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f6f1ea]">
      <div
        className="pointer-events-none absolute inset-0 hidden overflow-visible md:block"
        aria-hidden="true"
      >
        {pawPositions.map((p, i) => (
          <div
            key={`paw-${i}`}
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

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 md:px-8 md:py-10">
        <div className="grid w-full max-w-md gap-8 rounded-4xl border border-white/70 bg-white/78 p-3 shadow-[0_24px_70px_rgba(122,92,56,0.10)] backdrop-blur-xl md:max-w-6xl md:grid-cols-[1fr_420px] md:p-8 lg:gap-10 lg:p-12">
          <div className="relative hidden flex-col justify-center text-center md:flex md:text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#2d2520] sm:text-5xl lg:text-6xl">
              Hello, Pawrents!
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-[#dd7b61] sm:text-xl md:mx-0">
              Welcome to Pawket.
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#8f7c6b] sm:text-base md:mx-0">
              Every journey starts with a single step... or paw print!
            </p>

            <p className="mx-auto mt-1 max-w-xl text-sm font-medium leading-relaxed text-[#8f7c6b] sm:text-base md:mx-0">
              Your furry friends are waiting. Log in to continue your journey
              with them.
            </p>

            <div className="mt-8 hidden md:block">
              <PetIllustration />
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-md flex-col rounded-4xl border border-white/85 bg-white/88 p-5 shadow-[0_16px_40px_rgba(122,92,56,0.08)] backdrop-blur-sm sm:p-6 md:p-7">
            <div className="mb-5 md:hidden">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#e07a5f]">
                Pawket
              </p>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#8f7c6b] transition-all duration-300 ease-out">
                {isRegister
                  ? "Buat akun untuk mulai mengatur kebutuhan furry friends kamu."
                  : "Login untuk lanjut ke dashboard dan pantau furry friends kamu."}
              </p>
            </div>

            <div className="relative mb-6 grid grid-cols-2 rounded-2xl border border-[#efe4d7] bg-[#f7f1e8] p-1">
              <span
                className="absolute bottom-1 left-1 top-1 rounded-xl bg-white shadow-[0_6px_18px_rgba(122,92,56,0.10)] transition-all duration-300 ease-out"
                style={{
                  width: "calc(50% - 0.25rem)",
                  transform: isRegister
                    ? "translateX(calc(100% + 0.25rem))"
                    : "translateX(0)",
                }}
              />
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`relative z-10 rounded-xl px-3 py-2 text-sm font-extrabold transition-all duration-300 ease-out ${!isRegister ? "text-[#7a5c38]" : "text-[#9e8e7e] hover:text-[#7a5c38]"}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`relative z-10 rounded-xl px-3 py-2 text-sm font-extrabold transition-all duration-300 ease-out ${isRegister ? "text-[#7a5c38]" : "text-[#9e8e7e] hover:text-[#7a5c38]"}`}
              >
                Register
              </button>
            </div>

            <div className="mb-5 text-center transition-all duration-300 ease-out md:text-left">
              <h2 className="text-2xl font-black tracking-tight text-[#2d2520] sm:text-[1.75rem]">
                {isRegister ? "Create account" : "Welcome back"}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9e8e7e] transition-all duration-300 ease-out">
                {isRegister
                  ? "Register to open your Pawket dashboard."
                  : "Login to continue to your dashboard."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
              <div className="flex-1 space-y-4">
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-out ${isRegister ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  aria-hidden={!isRegister}
                >
                  <div className="min-h-0">
                    <label className="block pb-0.5">
                      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#9e8e7e]">
                        Name
                      </span>
                      <span className="flex items-center gap-2 rounded-2xl border border-[#e5d9cc] bg-[#fffdfa] px-3 py-3 transition-all duration-300 ease-out focus-within:border-[#d3b08c] focus-within:bg-white">
                        <UserRound size={17} className="text-[#b0a898]" />
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          disabled={!isRegister}
                          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#3d3530] outline-none placeholder:text-[#c4b9a8] disabled:cursor-default"
                        />
                      </span>
                    </label>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#9e8e7e]">
                    Email
                  </span>
                  <span className="flex items-center gap-2 rounded-2xl border border-[#e5d9cc] bg-[#fffdfa] px-3 py-3 transition-all duration-300 ease-out focus-within:border-[#d3b08c] focus-within:bg-white">
                    <Mail size={17} className="text-[#b0a898]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#3d3530] outline-none placeholder:text-[#c4b9a8]"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#9e8e7e]">
                    Password
                  </span>
                  <span className="flex items-center gap-2 rounded-2xl border border-[#e5d9cc] bg-[#fffdfa] px-3 py-3 transition-all duration-300 ease-out focus-within:border-[#d3b08c] focus-within:bg-white">
                    <Lock size={17} className="text-[#b0a898]" />
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#3d3530] outline-none placeholder:text-[#c4b9a8]"
                    />
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e07a5f] px-5 py-3.5 text-sm font-black text-white shadow-[0_12px_24px_rgba(224,122,95,0.28)] transition-all duration-300 ease-out hover:bg-[#d56f55] hover:shadow-[0_16px_28px_rgba(224,122,95,0.34)] active:scale-[0.985]"
              >
                {isRegister ? (
                  <UserPlus size={18} strokeWidth={3} />
                ) : (
                  <LogIn size={18} strokeWidth={3} />
                )}
                {isRegister ? "Register and Enter" : "Login and Enter"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
