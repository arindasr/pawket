import { useState } from 'react'
import Modal from './Modal'
import PetForm from './PetForm'

export default function AddPetModal({ isOpen, onClose, onAdd }) {
  const [name, setName]           = useState('')
  const [type, setType]           = useState('Cat')
  const [age, setAge]             = useState('')
  const [photoMode, setPhotoMode] = useState('url')
  const [photoUrl, setPhotoUrl]   = useState('')
  const [photoFile, setPhotoFile] = useState('')
  const [error, setError]         = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter a pet name.'); return }
    const finalPhoto = photoMode === 'url' ? photoUrl.trim() : photoFile
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      age: age.trim(),
      photo: finalPhoto,
      createdAt: Date.now(),
    })
    handleClose()
  }

  function handleClose() {
    setName(''); setType('Cat'); setAge('')
    setPhotoMode('url'); setPhotoUrl(''); setPhotoFile(''); setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Pet">
      <PetForm
        name={name}           setName={setName}
        type={type}           setType={setType}
        age={age}             setAge={setAge}
        photoMode={photoMode} setPhotoMode={setPhotoMode}
        photoUrl={photoUrl}   setPhotoUrl={setPhotoUrl}
        photoFile={photoFile} setPhotoFile={setPhotoFile}
        error={error}
        submitLabel="Add Pet"
        submitIcon="add"
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}
