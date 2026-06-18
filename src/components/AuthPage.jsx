import { useState } from 'react'
import { LogIn, UserPlus, PawPrint, Mail, Lock, UserRound } from 'lucide-react'
import petImage from '../assets/pet.png'

// ── Decorative paw SVG ──
function PawDecor({ size = 48, className = '' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 64 64" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="32" cy="42" rx="14" ry="12" fill="currentColor" />
      <ellipse cx="18" cy="28" rx="6"  ry="7"  fill="currentColor" />
      <ellipse cx="31" cy="23" rx="6"  ry="7"  fill="currentColor" />
      <ellipse cx="44" cy="26" rx="6"  ry="7"  fill="currentColor" />
      <ellipse cx="54" cy="35" rx="5"  ry="6"  fill="currentColor" />
    </svg>
  )
}

// ── Illustration: cat + dog using image ──
function PetIllustration() {
  return (
    <div className="flex justify-center items-center">
      <img 
        src={petImage} 
        alt="A cat and dog playing together"
        className="w-full max-w-[340px] drop-shadow-sm"
        loading="lazy"
      />
    </div>
  )
}

// ── Generate evenly distributed paw prints ──
const generatePawPositions = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const positions = []
  
  const cols = isMobile ? 5 : 8
  const rows = isMobile ? 5 : 7
  const total = cols * rows
  
  for (let i = 0; i < total; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    
    const offsetX = (Math.random() - 0.5) * 0.4
    const offsetY = (Math.random() - 0.5) * 0.4
    
    let top = ((row + 0.5) / rows + offsetY / rows) * 100
    let left = ((col + 0.5) / cols + offsetX / cols) * 100
    
    top = Math.max(3, Math.min(97, top))
    left = Math.max(3, Math.min(97, left))
    
    const size = isMobile 
      ? 22 + Math.floor(Math.random() * 20)
      : 30 + Math.floor(Math.random() * 28)
    
    positions.push({
      size,
      top,
      left,
      rotate: `${(Math.random() - 0.5) * 60}deg`,
      opacity: 0.2 + Math.random() * 0.25
    })
  }
  
  return positions
}

// ── Get or generate paw positions (permanent via localStorage) ──
const getPawPositions = () => {
  const STORAGE_KEY = 'pawket_paw_positions'
  
  // Coba ambil dari localStorage
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        // kalau corrupt, generate ulang
      }
    }
  }
  
  // Generate baru
  const positions = generatePawPositions()
  
  // Simpan ke localStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions))
    } catch (e) {
      // ignore
    }
  }
  
  return positions
}

// ✅ GENERATE SEKALI DAN SIMPAN PERMANEN
const INITIAL_PAW_POSITIONS = getPawPositions()

// ─────────────────────────────────────────────────────────
export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // ✅ PAKAI YANG SUDAH DISIMPAN (PERMANEN)
  const pawPositions = INITIAL_PAW_POSITIONS
  
  const isRegister = mode === 'register'

  function handleSubmit(e) {
    e.preventDefault()
    const cleanEmail = email.trim()
    if (!cleanEmail || !password.trim()) return
    onAuth({
      name: isRegister ? name.trim() || 'Pawrents' : cleanEmail.split('@')[0] || 'Pawrents',
      email: cleanEmail,
    })
  }

  return (
    <div className="relative min-h-dvh bg-[#f7f4ef] overflow-hidden flex flex-col">

      {/* ── Background paw prints — evenly distributed ── */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-visible" aria-hidden="true">
        {pawPositions.map((p, i) => (
          <div key={`paw-${i}`}
            className="absolute text-[#d9c8aa]"
            style={{ 
              top: `${p.top}%`, 
              left: `${p.left}%`,
              transform: `translate(-50%, -50%) rotate(${p.rotate})`,
              opacity: p.opacity
            }}
          >
            <PawDecor size={p.size} />
          </div>
        ))}
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="relative grid w-full max-w-6xl gap-8 rounded-[2rem] border-2 border-[#d9c8aa] bg-white/90 p-5 shadow-2xl backdrop-blur-sm md:grid-cols-[1fr_420px] md:p-8 lg:p-12">
          
          <div className="relative flex flex-col justify-center text-center md:text-left">
            <h1 className="text-4xl font-black leading-tight tracking-tight text-[#2d2520] sm:text-5xl lg:text-6xl">
              Hello, Pawrents!
            </h1>
            
            <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-[#e07a5f] sm:text-xl md:mx-0">
              Welcome to Pawket.
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm font-medium leading-relaxed text-[#8a7968] sm:text-base md:mx-0">
              Every journey starts with a single step... or paw print!
            </p>

            <p className="mx-auto mt-1 max-w-xl text-sm font-medium leading-relaxed text-[#8a7968] sm:text-base md:mx-0">
              Your furry friends are waiting. Log in to continue your journey with them.
            </p>

            <div className="mt-8 hidden md:block">
              <PetIllustration />
            </div>
          </div>

          <div className="relative rounded-[1.5rem] border-2 border-[#ede8e0] bg-[#fdfaf6] p-4 sm:p-6 flex flex-col">
            <div className="mb-5 grid grid-cols-2 rounded-2xl bg-[#f0ebe3] p-1">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`rounded-xl px-3 py-2 text-sm font-extrabold transition-colors ${!isRegister ? 'bg-white text-[#7a5c38] shadow-sm' : 'text-[#9e8e7e]'}`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`rounded-xl px-3 py-2 text-sm font-extrabold transition-colors ${isRegister ? 'bg-white text-[#7a5c38] shadow-sm' : 'text-[#9e8e7e]'}`}
              >
                Register
              </button>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-black tracking-tight text-[#2d2520]">
                {isRegister ? 'Create account' : 'Welcome back'}
              </h2>
              <p className="mt-1 text-sm font-medium text-[#9e8e7e]">
                {isRegister ? 'Register to open your Pawket dashboard.' : 'Login to continue to your dashboard.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                {isRegister && (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#9e8e7e]">Name</span>
                    <span className="flex items-center gap-2 rounded-2xl border-2 border-[#ddd5c8] bg-white px-3 py-3 focus-within:border-[#c4a882]">
                      <UserRound size={17} className="text-[#b0a898]" />
                      <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your name"
                        className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#3d3530] outline-none placeholder:text-[#c4b9a8]"
                      />
                    </span>
                  </label>
                )}

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#9e8e7e]">Email</span>
                  <span className="flex items-center gap-2 rounded-2xl border-2 border-[#ddd5c8] bg-white px-3 py-3 focus-within:border-[#c4a882]">
                    <Mail size={17} className="text-[#b0a898]" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#3d3530] outline-none placeholder:text-[#c4b9a8]"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#9e8e7e]">Password</span>
                  <span className="flex items-center gap-2 rounded-2xl border-2 border-[#ddd5c8] bg-white px-3 py-3 focus-within:border-[#c4a882]">
                    <Lock size={17} className="text-[#b0a898]" />
                    <input
                      type="password"
                      required
                      minLength={4}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 4 characters"
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-[#3d3530] outline-none placeholder:text-[#c4b9a8]"
                    />
                  </span>
                </label>

                <div className="mt-6 md:hidden">
                  <PetIllustration />
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e07a5f] px-5 py-3.5 text-sm font-black text-white shadow-md transition-all hover:bg-[#c96a50] active:scale-[0.98]"
              >
                {isRegister ? <UserPlus size={18} strokeWidth={3} /> : <LogIn size={18} strokeWidth={3} />}
                {isRegister ? 'Register and Enter' : 'Login and Enter'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
