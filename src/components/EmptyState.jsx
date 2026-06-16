import { PawPrint, Cat, Squirrel, Plus } from 'lucide-react'

export default function EmptyState({ onAddPet }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-80px)] px-6 text-center">
      {/* Illustration cluster */}
      <div className="relative mb-8">
        {/* Central paw circle */}
        <div className="w-40 h-40 rounded-full bg-[#fde8df] border-2 border-[#f4cbb8] flex items-center justify-center">
          <PawPrint size={64} strokeWidth={1.5} className="text-[#e07a5f]" />
        </div>
        {/* Cat bubble */}
        <div className="absolute -top-2 -right-3 w-12 h-12 bg-[#fef9e7] border-2 border-[#f5e5a0] rounded-full flex items-center justify-center">
          <Cat size={22} strokeWidth={1.5} className="text-[#c4940a]" />
        </div>
        {/* Hamster bubble */}
        <div className="absolute -bottom-1 -left-4 w-12 h-12 bg-[#f0ebe3] border-2 border-[#ddd5c8] rounded-full flex items-center justify-center">
          <Squirrel size={22} strokeWidth={1.5} className="text-[#7a6a58]" />
        </div>
      </div>

      {/* Text */}
      <h1 className="text-3xl font-extrabold text-[#2d2520] mb-2 tracking-tight">
        Hello, Pawrents!
      </h1>
      <h2 className="text-lg font-bold text-[#7a6a58] mb-4">
        Welcome to Pawket.
      </h2>
      <p className="text-[#9e8e7e] text-sm max-w-xs leading-relaxed mb-10">
        You don't have any pets registered yet.
        Start tracking your fur babies' daily routines and supplies!
      </p>

      {/* CTA — warm coral, consistent with Add Pet button */}
      <button
        onClick={onAddPet}
        className="flex items-center gap-2 px-10 py-4 rounded-3xl bg-[#e07a5f] text-white font-bold text-base hover:bg-[#c96a50] active:scale-95 transition-all"
      >
        <Plus size={18} strokeWidth={3} />
        Add My Pet
      </button>

      <p className="text-xs text-[#b0a898] mt-6">Track meals, water, playtime & supplies</p>
    </div>
  )
}
