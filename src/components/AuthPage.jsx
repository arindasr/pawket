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

// ── Generate paw positions ──
const generatePawPositions = () => {
  const positions = [];
  const cols = 8;
  const rows = 7;
  for (let i = 0; i < cols * rows; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const offsetX = (Math.random() - 0.5) * 0.4;
    const offsetY = (Math.random() - 0.5) * 0.4;
    positions.push({
      size: 32 + Math.floor(Math.random() * 32),
      top: Math.max(3, Math.min(97, ((row + 0.5) / rows + offsetY / rows) * 100)),
      left: Math.max(3, Math.min(97, ((col + 0.5) / cols + offsetX / cols) * 100)),
      rotate: `${(Math.random() - 0.5) * 60}deg`,
      opacity: 0.15 + Math.random() * 0.2,
    });
  }
  return positions;
};

const getPawPositions = () => {
  const KEY = "pawket_paw_positions_desktop";
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
  }
  const positions = generatePawPositions();
  try { localStorage.setItem(KEY, JSON.stringify(positions)); } catch { /* ignore */ }
  return positions;
};

const INITIAL_PAW_POSITIONS = getPawPositions();

// ── Reusable input field ──
function InputField({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-3 rounded-2xl border border-[#e5d9cc] bg-white px-4 py-4 transition-all duration-200 focus-within:border-[#d3b08c] focus-within:ring-2 focus-within:ring-[#d3b08c]/20">
      <Icon size={20} className="shrink-0 text-[#b8a898]" />
      {children}
    </span>
  );
}

// ── Reusable form JSX (used in both desktop & mobile) ──
function AuthForm({ isRegister, name, setName, email, setEmail, password, setPassword, onSubmit, onSwitch }) {
  return (
    <div className="w-full max-w-md">
      {/* Heading */}
      <div className="mb-8">
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-[#e07a5f]">
          {isRegister ? "New here?" : "Back again?"}
        </p>
        <h2 className="text-4xl font-black tracking-tight text-[#2d2520]">
          {isRegister ? "Create account" : "Welcome back"}
        </h2>
        <p className="mt-2.5 text-base font-medium text-[#9e8e7e]">
          {isRegister
            ? "Register to open your Pawket dashboard."
            : "Login to continue to your dashboard."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {/* Name — animated show/hide */}
        <div
          className={`grid overflow-hidden transition-all duration-300 ease-out ${
            isRegister ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!isRegister}
        >
          <div className="min-h-0">
            <label className="block pb-0.5">
              <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#a89880]">
                Name
              </span>
              <InputField icon={UserRound}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  disabled={!isRegister}
                  className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#3d3530] outline-none placeholder:text-[#c4b9a8] disabled:cursor-default"
                />
              </InputField>
            </label>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#a89880]">
            Email
          </span>
          <InputField icon={Mail}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#3d3530] outline-none placeholder:text-[#c4b9a8]"
            />
          </InputField>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-[#a89880]">
            Password
          </span>
          <InputField icon={Lock}>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 4 characters"
              className="min-w-0 flex-1 bg-transparent text-base font-medium text-[#3d3530] outline-none placeholder:text-[#c4b9a8]"
            />
          </InputField>
        </label>

        <button
          type="submit"
          className="mt-1 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#e07a5f] py-4 text-base font-black text-white shadow-[0_8px_24px_rgba(224,122,95,0.32)] transition-all duration-200 hover:bg-[#d56f55] hover:shadow-[0_12px_28px_rgba(224,122,95,0.38)] active:scale-[0.98]"
        >
          {isRegister ? <UserPlus size={20} strokeWidth={2.5} /> : <LogIn size={20} strokeWidth={2.5} />}
          {isRegister ? "Register and Enter" : "Login and Enter"}
        </button>
      </form>

      {/* Mobile switch link */}
      {onSwitch && (
        <p className="mt-7 text-center text-sm font-medium text-[#9e8e7e]">
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-bold text-[#e07a5f] hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  function switchMode() {
    setMode(isRegister ? "login" : "register");
  }

  // login    → hero left (0%),  form right (50%)
  // register → form left (0%),  hero right (50%)
  const heroLeft = isRegister ? "50%" : "0%";
  const formLeft = isRegister ? "0%"  : "50%";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#f5f0e8]">

      {/* Paw background — only visible behind hero panel */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
        {INITIAL_PAW_POSITIONS.map((p, i) => (
          <div
            key={i}
            className="absolute text-[#c8b89a]"
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

      {/* ── Desktop: sliding panels ── */}
      <div className="relative hidden min-h-dvh w-full md:block">

        {/* Hero panel */}
        <div
          className="absolute top-0 h-full w-1/2 transition-[left] duration-700 ease-in-out"
          style={{ left: heroLeft }}
        >
          <div className="flex h-full flex-col items-center justify-center px-12 py-16 lg:px-20">
            <div className="flex w-full max-w-md flex-col items-center text-center">
              <h1 className="text-5xl font-black leading-tight tracking-tight text-[#2d2520] lg:text-6xl">
                {isRegister ? (
                  <>Already have<br />an account?</>
                ) : (
                  <>Hello,<br />Pawrents!</>
                )}
              </h1>

              <p className="mt-5 text-xl font-bold text-[#dd7b61]">
                {isRegister ? "Welcome back." : "Welcome to Pawket."}
              </p>

              <p className="mt-3 text-base font-medium leading-relaxed text-[#8f7c6b] lg:text-lg">
                {isRegister
                  ? "Log back in and continue your journey with your furry friends."
                  : "Every journey starts with a single step — or paw print. Your furry friends are waiting."}
              </p>

              <button
                type="button"
                onClick={switchMode}
                className="mt-8 rounded-2xl border-2 border-[#e07a5f] px-10 py-3.5 text-base font-black text-[#e07a5f] transition-all duration-200 hover:bg-[#e07a5f] hover:text-white active:scale-[0.98]"
              >
                {isRegister ? "Login" : "Register"}
              </button>

              <div className="mt-10 w-full">
                <img
                  src={petImage}
                  alt="A cat and dog playing together"
                  className="w-full drop-shadow-sm"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="absolute top-0 h-full w-px bg-[#e0d5c8]" style={{ left: "50%" }} />

        {/* Form panel */}
        <div
          className="absolute top-0 h-full w-1/2 bg-white/85 backdrop-blur-md transition-[left] duration-700 ease-in-out"
          style={{ left: formLeft }}
        >
          <div className="flex h-full flex-col items-center justify-center px-12 py-16 lg:px-20">
            <AuthForm
              isRegister={isRegister}
              name={name} setName={setName}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile: stacked layout ── */}
      <div className="flex min-h-dvh flex-col items-center justify-center px-5 py-12 md:hidden">
        <div className="mb-8">
          <img
            src={petImage}
            alt="A cat and dog playing together"
            className="h-36 w-auto drop-shadow-sm"
            loading="lazy"
          />
        </div>
        <AuthForm
          isRegister={isRegister}
          name={name} setName={setName}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          onSubmit={handleSubmit}
          onSwitch={switchMode}
        />
      </div>
    </div>
  );
}
