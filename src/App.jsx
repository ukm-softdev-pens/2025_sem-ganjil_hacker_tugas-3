import { useEffect, useState } from 'react'
import './App.css'
import {
  db
} from './firebase'
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  
  const handleAdd = async (e) => {
    e.preventDefault();
    if (title === '' || description === '') {
      alert("Masukkan title dan description terlebih dahulu!");
      return;
    }

    try {
      await addDoc(collection(db, 'notes'), {
        title: title,
        description: description,
        createdAt: serverTimestamp()
      })
      setTitle('')
      setDescription('')
    } catch (err) {
      console.error('Add failed', err)
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setNotes(items)
      setLoading(false)
    }, (err) => {
      console.error('Snapshot error', err)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  function startEdit(note) {
    setEditingId(note.id)
    setTitle(note.title)
    setDescription(note.description)
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!editingId) return
    try {
      const noteRef = doc(db, 'notes', editingId)
      await updateDoc(noteRef, {
        title: title.trim(),
        description: description.trim(),
        updatedAt: serverTimestamp()
      })
      setEditingId(null)
      setTitle('')
      setDescription('')
    } catch (err) {
      console.error('Update failed', err)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus catatan ini?')) return
    try {
      await deleteDoc(doc(db, 'notes', id))
    } catch (err) {
      console.error('Delete failed', err)
    }
  }

  return (
    <div>
      <div className="app-container">
        <header>
          <h1>Notes App</h1>
          <p className="subtitle">Note App</p>
        </header>

        <main>
          <section className="form-section">
            <form onSubmit={editingId ? handleUpdate : handleAdd} className="note-form">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="input"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="textarea"
                rows={4}
              />
              <div className="form-actions">
                <button type="submit" className="btn primary">
                  {editingId ? 'Update' : 'Add Note'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => { setEditingId(null); setTitle(''); setDescription('') }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="list-section">
            {loading ? (
              <div className="loading">Loading notes...</div>
            ) : (
              <div className="notes-list">
                {notes.length === 0 && <div className="no-notes">Belum ada catatan</div>}
                {notes.map(note => (
                  <article key={note.id} className="note-card">
                    <div className="note-content">
                      <h3>{note.title}</h3>
                      <p>{note.description}</p>
                    </div>
                    <div className="note-actions">
                      <button className="btn small" onClick={() => startEdit(note)}>Edit</button>
                      <button className="btn danger small" onClick={() => handleDelete(note.id)}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
