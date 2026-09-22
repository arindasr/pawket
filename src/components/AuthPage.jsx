import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import petImage from "../assets/pet.png";

// ── Google icon SVG ──
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

// ── Password input with show/hide toggle ──
function PasswordInput({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        required
        minLength={6}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#e8e0d8] bg-[#faf8f5] px-4 py-3 pr-11 text-sm text-[#2d2520] outline-none transition placeholder:text-[#bbb0a4] focus:border-[#e07a5f] focus:bg-white focus:ring-2 focus:ring-[#e07a5f]/15"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b0a090] transition hover:text-[#e07a5f]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

// ── Field wrapper ──
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#a89880]">
        {label}
      </label>
      {children}
    </div>
  );
}

// ── Auth form ──
function AuthForm({ isRegister, onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isRegister) {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: name.trim() || "Pawrents" },
        },
      });
      if (signUpError) setError(signUpError.message);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (signInError) setError(signInError.message);
    }

    setLoading(false);
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (googleError) {
      setError(googleError.message);
      setGoogleLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e1a17] tracking-tight">
          {isRegister ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-[#9e8e7e]">
          {isRegister
            ? "Start managing your pets today."
            : "Sign in to continue to Pawket."}
        </p>
      </div>

      {/* Email/password form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name — animated */}
        <div
          className={`grid overflow-hidden transition-all duration-300 ease-out ${
            isRegister ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          aria-hidden={!isRegister}
        >
          <div className="min-h-0">
            <Field label="Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={!isRegister}
                className="w-full rounded-xl border border-[#e8e0d8] bg-[#faf8f5] px-4 py-3 text-sm text-[#2d2520] outline-none transition placeholder:text-[#bbb0a4] focus:border-[#e07a5f] focus:bg-white focus:ring-2 focus:ring-[#e07a5f]/15 disabled:cursor-default"
              />
            </Field>
          </div>
        </div>

        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#e8e0d8] bg-[#faf8f5] px-4 py-3 text-sm text-[#2d2520] outline-none transition placeholder:text-[#bbb0a4] focus:border-[#e07a5f] focus:bg-white focus:ring-2 focus:ring-[#e07a5f]/15"
          />
        </Field>

        <Field label="Password">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </Field>

        {/* Error message */}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="mt-1 w-full rounded-xl bg-[#e07a5f] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d46e55] active:scale-[0.98] disabled:opacity-60"
        >
          {loading
            ? isRegister ? "Creating account…" : "Signing in…"
            : isRegister ? "Create account" : "Sign in"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#e8e0d8]" />
        <span className="text-xs text-[#bbb0a4]">or</span>
        <div className="h-px flex-1 bg-[#e8e0d8]" />
      </div>

      {/* Google button */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#e8e0d8] bg-white py-3 text-sm font-medium text-[#2d2520] shadow-sm transition hover:bg-[#faf8f5] active:scale-[0.98] disabled:opacity-60"
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      {/* Switch mode */}
      <p className="mt-5 text-center text-sm text-[#9e8e7e]">
        {isRegister ? "Already have an account? " : "Don't have an account? "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-[#e07a5f] hover:underline"
        >
          {isRegister ? "Sign in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const isRegister = mode === "register";

  function switchMode() {
    setMode(isRegister ? "login" : "register");
  }

  return (
    <div className="min-h-dvh flex">

      {/* ── Left panel: illustration (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-[#fdf0e8]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,_#f5c9aa_0%,_transparent_65%)] opacity-60" />
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-12 xl:px-20 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e07a5f]">Pawket</p>
          <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-[#1e1a17] tracking-tight">
            Your pet care<br />companion
          </h2>
          <p className="mt-4 max-w-sm text-base text-[#9e8e7e] leading-relaxed">
            Track health records, notes, and milestones for all your furry friends — all in one place.
          </p>
          <div className="mt-10 w-full max-w-sm">
            <img src={petImage} alt="Happy pets" className="w-full drop-shadow-md" loading="lazy" />
          </div>
        </div>
      </div>

      {/* ── Right panel: form (desktop) ── */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-center bg-white px-10 xl:px-16">
        <div className="w-full max-w-sm">
          <AuthForm isRegister={isRegister} onSwitch={switchMode} />
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex lg:hidden flex-col w-full min-h-dvh">

        {/* Top hero area */}
        <div className="relative overflow-hidden bg-[#fdf0e8] flex flex-col items-center justify-end px-6 pt-14 pb-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,_#f5c9aa_0%,_transparent_70%)] opacity-70" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <img
              src={petImage}
              alt="Happy pets"
              className="h-44 w-auto drop-shadow-md"
              loading="lazy"
            />
            <h2 className="mt-5 text-2xl font-bold text-[#1e1a17] tracking-tight leading-snug">
              Your pet care companion
            </h2>
            <p className="mt-1.5 text-sm text-[#9e8e7e] max-w-xs">
              Track health records, notes, and milestones for all your furry friends.
            </p>
          </div>
        </div>

        {/* Bottom form area */}
        <div className="flex flex-1 flex-col justify-center bg-white px-6 py-8 sm:px-10">
          <div className="w-full max-w-sm mx-auto">
            <AuthForm isRegister={isRegister} onSwitch={switchMode} />
          </div>
        </div>
      </div>

    </div>
  );
}
