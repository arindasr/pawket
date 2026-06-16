/**
 * Shared form body for Add Pet and Edit Pet modals.
 * Uses lucide-react icons throughout — no system emojis.
 */
import { useRef } from 'react'
import { Cat, Squirrel, Link2, Upload, Camera, PlusCircle, Save } from 'lucide-react'

const PET_TYPES = [
  { value: 'Cat',     label: 'Cat',     Icon: Cat      },
  { value: 'Hamster', label: 'Hamster', Icon: Squirrel },
]

export default function PetForm({
  name, setName,
  type, setType,
  age, setAge,
  photoMode, setPhotoMode,
  photoUrl, setPhotoUrl,
  photoFile, setPhotoFile,
  error,
  submitLabel,
  submitIcon = 'add', // 'add' | 'save'
  onSubmit,
}) {
  const fileRef = useRef()

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = ev => setPhotoFile(ev.target.result)
    reader.readAsDataURL(file)
  }

  const previewSrc = photoMode === 'url' ? photoUrl : photoFile

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Pet Name */}
      <div>
        <label className="block text-sm font-bold text-[#5c4f3d] mb-1.5">
          Pet Name <span className="text-[#e07a5f]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Chester, Mochi…"
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#ddd5c8] focus:border-[#c4a882] focus:outline-none text-[#3d3530] placeholder-[#c4b9a8] bg-[#faf7f3] text-sm"
        />
      </div>

      {/* Pet Type */}
      <div>
        <label className="block text-sm font-bold text-[#5c4f3d] mb-1.5">
          Pet Type
        </label>
        <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
          {PET_TYPES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border-2 font-bold text-sm transition-colors ${
                type === value
                  ? 'border-[#f4cbb8] bg-[#fde8df] text-[#9b4b2c]'
                  : 'border-[#ddd5c8] bg-white text-[#8a7968] hover:border-[#c4b9a8]'
              }`}
            >
              <Icon size={15} strokeWidth={2} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Age */}
      <div>
        <label className="block text-sm font-bold text-[#5c4f3d] mb-1.5">
          Age <span className="text-[#9e8e7e] font-normal">(optional)</span>
        </label>
        <input
          type="text"
          value={age}
          onChange={e => setAge(e.target.value)}
          placeholder="e.g. 2 years, 6 months…"
          className="w-full px-4 py-3 rounded-2xl border-2 border-[#ddd5c8] focus:border-[#c4a882] focus:outline-none text-[#3d3530] placeholder-[#c4b9a8] bg-[#faf7f3] text-sm"
        />
      </div>

      {/* Pet Photo */}
      <div>
        <label className="block text-sm font-bold text-[#5c4f3d] mb-1.5">
          Pet Photo <span className="text-[#9e8e7e] font-normal">(optional)</span>
        </label>
        <div className="grid grid-cols-1 gap-2 mb-3 min-[380px]:grid-cols-2">
          <button
            type="button"
            onClick={() => setPhotoMode('url')}
            className={`flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-full border-2 font-bold transition-colors ${
              photoMode === 'url'
                ? 'bg-[#fde8df] border-[#f4cbb8] text-[#9b4b2c]'
                : 'bg-white border-[#ddd5c8] text-[#8a7968]'
            }`}
          >
            <Link2 size={11} strokeWidth={2.5} />
            Image URL
          </button>
          <button
            type="button"
            onClick={() => setPhotoMode('file')}
            className={`flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-full border-2 font-bold transition-colors ${
              photoMode === 'file'
                ? 'bg-[#fde8df] border-[#f4cbb8] text-[#9b4b2c]'
                : 'bg-white border-[#ddd5c8] text-[#8a7968]'
            }`}
          >
            <Upload size={11} strokeWidth={2.5} />
            Upload File
          </button>
        </div>

        {photoMode === 'url' ? (
          <input
            type="url"
            value={photoUrl}
            onChange={e => setPhotoUrl(e.target.value)}
            placeholder="https://example.com/pet.jpg"
            className="w-full px-4 py-3 rounded-2xl border-2 border-[#ddd5c8] focus:border-[#c4a882] focus:outline-none text-[#3d3530] placeholder-[#c4b9a8] bg-[#faf7f3] text-sm"
          />
        ) : (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#c4b9a8] text-[#8a7968] hover:bg-[#f0ebe3] transition-colors text-sm font-bold"
            >
              <Camera size={15} strokeWidth={2} />
              Click to upload photo
            </button>
          </div>
        )}

        {previewSrc && (
          <div className="mt-3 flex justify-center">
            <img
              src={previewSrc}
              alt="Preview"
              className="w-24 h-24 rounded-2xl object-cover border-2 border-[#ddd5c8]"
            />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="text-[#c0392b] text-sm bg-[#fdf0ed] border border-[#f5c6bc] px-4 py-2.5 rounded-2xl">
          {error}
        </p>
      )}

      {/* Submit — warm coral to match Add Pet button */}
      <button
        type="submit"
        className="w-full py-3.5 rounded-2xl bg-[#e07a5f] text-white font-bold text-base hover:bg-[#c96a50] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
      >
        {submitIcon === 'save'
          ? <Save size={16} strokeWidth={2.5} />
          : <PlusCircle size={16} strokeWidth={2.5} />
        }
        {submitLabel}
      </button>
    </form>
  )
}
