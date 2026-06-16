import { Plus, Utensils, Droplets, PartyPopper, HeartPulse, PawPrint } from 'lucide-react'

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

// ── Illustration: cat + dog SVG scene ──
function PetIllustration() {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[340px] drop-shadow-sm" aria-label="A cat and dog playing together">
      <ellipse cx="110" cy="200" rx="52" ry="44" fill="#e8c99a" />
      <circle cx="110" cy="138" r="38" fill="#e8c99a" />
      <ellipse cx="80"  cy="118" rx="14" ry="22" fill="#d4a96a" transform="rotate(-15 80 118)" />
      <ellipse cx="140" cy="118" rx="14" ry="22" fill="#d4a96a" transform="rotate(15 140 118)" />
      <ellipse cx="110" cy="152" rx="18" ry="13" fill="#f5ddb0" />
      <ellipse cx="110" cy="147" rx="7" ry="5" fill="#c4845a" />
      <circle cx="97"  cy="133" r="5" fill="#3d2b1a" />
      <circle cx="123" cy="133" r="5" fill="#3d2b1a" />
      <circle cx="99"  cy="131" r="1.5" fill="white" />
      <circle cx="125" cy="131" r="1.5" fill="white" />
      <path d="M102 158 Q110 165 118 158" stroke="#c4845a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M60 218 Q30 200 38 175 Q45 155 62 165" stroke="#d4a96a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <rect x="74"  y="228" width="22" height="28" rx="11" fill="#e8c99a" />
      <rect x="114" y="228" width="22" height="28" rx="11" fill="#e8c99a" />
      <rect x="90" y="165" width="40" height="10" rx="5" fill="#e07a5f" />
      <circle cx="110" cy="170" r="4" fill="#c96a50" />
      <ellipse cx="218" cy="205" rx="46" ry="40" fill="#f0c8b0" />
      <circle cx="218" cy="142" r="34" fill="#f0c8b0" />
      <polygon points="192,122 183,96 207,112" fill="#f0c8b0" />
      <polygon points="190,120 184,100 204,114" fill="#e8a898" />
      <polygon points="244,122 253,96 229,112" fill="#f0c8b0" />
      <polygon points="246,120 252,100 232,114" fill="#e8a898" />
      <ellipse cx="218" cy="155" rx="15" ry="10" fill="#fde8df" />
      <path d="M214 150 L218 154 L222 150 Z" fill="#e07a5f" />
      <path d="M213 157 Q218 162 223 157" stroke="#c96a50" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M206 137 Q210 132 214 137" stroke="#3d2b1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M222 137 Q226 132 230 137" stroke="#3d2b1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="200" y1="153" x2="215" y2="155" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="199" y1="158" x2="214" y2="157" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="221" y1="155" x2="236" y2="153" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="222" y1="157" x2="237" y2="158" stroke="#c4a882" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M264 218 Q292 205 285 178 Q278 158 262 170" stroke="#e8b898" strokeWidth="11" strokeLinecap="round" fill="none" />
      <rect x="184" y="232" width="20" height="26" rx="10" fill="#f0c8b0" />
      <rect x="220" y="232" width="20" height="26" rx="10" fill="#f0c8b0" />
      <rect x="200" y="168" width="36" height="9" rx="4.5" fill="#fde8df" />
      <circle cx="218" cy="172" r="3.5" fill="#f4cbb8" />
      <ellipse cx="164" cy="262" rx="90" ry="8" fill="#d9c8aa" opacity="0.35" />
      <path d="M156 175 C156 169 161 164 167 167 C173 164 178 169 178 175 C178 181 167 190 167 190 C167 190 156 181 156 175Z"
        fill="#e07a5f" opacity="0.85" />
    </svg>
  )
}

// ── Feature pill ──
function FeaturePill({ Icon, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-11 h-11 rounded-2xl bg-[#f0ebe3] border border-[#ddd5c8] flex items-center justify-center">
        <Icon size={18} strokeWidth={2} className="text-[#9b6a3a]" />
      </div>
      <span className="text-[11px] font-semibold text-[#9e8e7e]">{label}</span>
    </div>
  )
}

const FEATURES = [
  { Icon: Utensils,   label: 'Meals'    },
  { Icon: Droplets,   label: 'Water'    },
  { Icon: PartyPopper,label: 'Playtime' },
  { Icon: HeartPulse, label: 'Health'   },
]

// ── Generate evenly distributed paw prints ──
const generatePawPositions = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const positions = []
  
  // Grid-based distribution with random offset - more controlled
  const cols = isMobile ? 5 : 8
  const rows = isMobile ? 5 : 7
  const total = cols * rows
  
  // Create a grid
  for (let i = 0; i < total; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    
    // Random offset within cell (40% random)
    const offsetX = (Math.random() - 0.5) * 0.4
    const offsetY = (Math.random() - 0.5) * 0.4
    
    // Calculate position
    let top = ((row + 0.5) / rows + offsetY / rows) * 100
    let left = ((col + 0.5) / cols + offsetX / cols) * 100
    
    // Clamp to avoid edges
    top = Math.max(3, Math.min(97, top))
    left = Math.max(3, Math.min(97, left))
    
    // Varying sizes
    const size = isMobile 
      ? 22 + Math.floor(Math.random() * 20) // 22-42px
      : 30 + Math.floor(Math.random() * 28) // 30-58px
    
    positions.push({
      size,
      top,
      left,
      rotate: `${(Math.random() - 0.5) * 60}deg`,
      opacity: 0.2 + Math.random() * 0.25 // 0.20-0.45
    })
  }
  
  return positions
}

// ─────────────────────────────────────────────────────────
export default function EmptyState({ onAddPet }) {
  const pawPositions = generatePawPositions()

  return (
    <div className="relative min-h-full bg-[#f7f4ef] overflow-hidden flex flex-col">

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

      {/* ── Main content with border ── */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
        <div className="relative w-full max-w-6xl bg-white/85 backdrop-blur-sm rounded-3xl border-2 border-[#d9c8aa] shadow-2xl p-6 md:p-10 lg:p-14">
          
          {/* Inner decorative border */}
          <div className="absolute inset-2 rounded-2xl border border-[#f0ebe3] pointer-events-none" />
          
          {/* ── Main split layout ── */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16">

            {/* ── Left: Text & CTA ── */}
            <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left max-w-lg">

              {/* Eyebrow */}
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-[#c97b4b] mb-4 bg-[#fde8df] px-3 py-1.5 rounded-full border border-[#f4cbb8]">
                <PawPrint size={11} strokeWidth={2.5} />
                Your Pet Tracker
              </span>

              {/* Headings */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#2d2520] tracking-tight leading-tight mb-2">
                Hello,<br />Pawrents!
              </h1>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#9b6a3a] mb-4 md:mb-5">
                Welcome to Pawket.
              </h2>

              {/* Description */}
              <p className="text-[#9e8e7e] text-xs sm:text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-sm">
                Every journey starts with a single step&hellip; or paw print!
                Let&rsquo;s get your furry family member settled in.
                Just one click to begin.
              </p>

              {/* CTA button */}
              <button
                onClick={onAddPet}
                className="flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#e07a5f] text-white font-black text-sm sm:text-base hover:bg-[#c96a50] hover:scale-105 active:scale-95 transition-all duration-200 shadow-md mb-6 md:mb-10"
                aria-label="Add your first pet"
              >
                <Plus size={18} strokeWidth={3} />
                Add My Pet
              </button>

              {/* Feature row */}
              <div className="flex items-start gap-4 sm:gap-5 md:gap-7">
                {FEATURES.map(f => <FeaturePill key={f.label} {...f} />)}
              </div>
            </div>

            {/* ── Right: Illustration ── */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] md:w-[310px] md:h-[310px] lg:w-[380px] lg:h-[380px] rounded-full bg-[#fde8df] opacity-40" />
                <div className="absolute w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[240px] md:h-[240px] lg:w-[300px] lg:h-[300px] rounded-full bg-[#fde8df] opacity-50" />
                <div className="relative z-10 w-[180px] sm:w-[230px] md:w-[260px] lg:w-[320px]">
                  <PetIllustration />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
} 