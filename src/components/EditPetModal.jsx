import { useState, useEffect } from 'react'
import Modal from './Modal'
import PetForm from './PetForm'

export default function EditPetModal({ pet, isOpen, onClose, onSave }) {
  const [name, setName]           = useState('')
  const [type, setType]           = useState('Cat')
  const [age, setAge]             = useState('')
  const [photoMode, setPhotoMode] = useState('url')
  const [photoUrl, setPhotoUrl]   = useState('')
  const [photoFile, setPhotoFile] = useState('')
  const [error, setError]         = useState('')

  // Pre-fill form whenever the modal opens with a different pet
  useEffect(() => {
    if (!pet) return undefined

    let active = true
    queueMicrotask(() => {
      if (!active) return
      setName(pet.name ?? '')
      setType(pet.type ?? 'Cat')
      setAge(pet.age ?? '')
      // Detect whether the stored photo is a URL or base64 data URI.
      const isBase64 = (pet.photo ?? '').startsWith('data:')
      if (isBase64) {
        setPhotoMode('file')
        setPhotoFile(pet.photo)
        setPhotoUrl('')
      } else {
        setPhotoMode('url')
        setPhotoUrl(pet.photo ?? '')
        setPhotoFile('')
      }
      setError('')
    })

    return () => { active = false }
  }, [pet, isOpen])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter a pet name.'); return }
    const finalPhoto = photoMode === 'url' ? photoUrl.trim() : photoFile
    onSave({
      ...pet,
      name: name.trim(),
      type,
      age: age.trim(),
      photo: finalPhoto,
    })
    onClose()
  }

  if (!pet) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${pet.name}`}>
      <PetForm
        name={name}           setName={setName}
        type={type}           setType={setType}
        age={age}             setAge={setAge}
        photoMode={photoMode} setPhotoMode={setPhotoMode}
        photoUrl={photoUrl}   setPhotoUrl={setPhotoUrl}
        photoFile={photoFile} setPhotoFile={setPhotoFile}
        error={error}
        submitLabel="Save Changes"
        submitIcon="save"
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}
