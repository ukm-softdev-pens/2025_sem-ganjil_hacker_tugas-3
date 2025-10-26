import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { db, auth } from './firebase';

// --- Ikon SVG sebagai Komponen ---
// Menggunakan ikon SVG langsung memastikan tidak ada dependensi eksternal dan memuat lebih cepat.
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Komponen untuk indikator loading
const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-10 col-span-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
    </div>
);


// --- Komponen Utama Aplikasi ---
export default function App() {
  const [dinos, setDinos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentDino, setCurrentDino] = useState(null);
  const [dinoToDelete, setDinoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Inisialisasi Auth & User ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        try {
          if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
            await signInWithCustomToken(auth, __initial_auth_token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error("Error signing in:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Mengambil data dari Firestore secara real-time
  useEffect(() => {
    if (db && userId) {
        setLoading(true);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const dinosCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'dinos');
        
        const unsubscribe = onSnapshot(dinosCollectionRef, (snapshot) => {
            const dinosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDinos(dinosData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching dinos:", error);
            setLoading(false);
        });

        return () => unsubscribe(); // Membersihkan listener saat komponen unmount
    }
  }, [db, userId]);
  
  // --- Fungsi Handler untuk Operasi CRUD ---

  const handleOpenModal = (dino = null) => {
    setCurrentDino(dino);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDino(null);
  };
  
  const handleOpenDeleteConfirm = (dino) => {
    setDinoToDelete(dino);
    setIsDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDinoToDelete(null);
  };
  
  const handleSaveDino = async (dinoData) => {
    if (!db || !userId) return;
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    
    // Menghapus properti id jika ada, karena Firestore akan menanganinya
    const { id, ...payload } = {
        ...dinoData,
        imageUrl: `https://placehold.co/600x400/1a202c/4a5568?text=${dinoData.name.replace(' ', '+')}`,
    };

    if (currentDino) {
        // Update
        const dinoDocRef = doc(db, 'artifacts', appId, 'users', userId, 'dinos', currentDino.id);
        await updateDoc(dinoDocRef, payload);
    } else {
        // Create
        const dinosCollectionRef = collection(db, 'artifacts', appId, 'users', userId, 'dinos');
        await addDoc(dinosCollectionRef, payload);
    }
    handleCloseModal();
  };
  
  const handleDeleteDino = async () => {
    if (dinoToDelete && db && userId) {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const dinoDocRef = doc(db, 'artifacts', appId, 'users', userId, 'dinos', dinoToDelete.id);
        await deleteDoc(dinoDocRef);
        handleCloseDeleteConfirm();
    }
  };
  
  // Filter dinosaurus berdasarkan pencarian
  const filteredDinos = dinos.filter(dino => 
    dino.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dino.era.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dino.diet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-white p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Efek Latar Belakang Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/50 via-gray-900 to-gray-900 opacity-50 z-0"></div>
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse delay-2000"></div>

      <main className="relative z-10">
        <div className="container mx-auto">
          <header className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 tracking-wider" style={{ textShadow: '0 0 15px rgba(0, 255, 255, 0.7)' }}>
              DinoData Hub
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Manajemen Koleksi Bio-Data Dinosaurus</p>
             {userId && <p className="text-xs text-gray-500 mt-2">User ID: {userId}</p>}
          </header>
          
          {/* Kontrol: Search & Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full sm:w-auto">
              <input 
                type="text"
                placeholder="Cari dinosaurus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-gray-800/50 border border-cyan-500/30 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
              />
            </div>
            <button 
              onClick={() => handleOpenModal()}
              disabled={!userId}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-2 px-6 rounded-lg shadow-lg shadow-cyan-500/20 transform hover:scale-105 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              <PlusIcon />
              <span>Tambah Data</span>
            </button>
          </div>
        </div>
        
        {/* Grid Kartu Dinosaurus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
                <LoadingSpinner />
            ) : filteredDinos.length > 0 ? (
                filteredDinos.map(dino => (
                    <DinoCard key={dino.id} dino={dino} onEdit={handleOpenModal} onDelete={handleOpenDeleteConfirm} />
                ))
            ) : (
                 <div className="text-center col-span-full py-16">
                    <p className="text-gray-500 text-2xl">
                        {searchTerm ? "Data tidak ditemukan." : "Belum ada data. Silakan tambah data baru."}
                    </p>
                </div>
            )}
        </div>
      </main>
      
      {isModalOpen && <DinoModal dino={currentDino} onClose={handleCloseModal} onSave={handleSaveDino} />}
      {isDeleteConfirmOpen && <DeleteConfirmationModal onClose={handleCloseDeleteConfirm} onConfirm={handleDeleteDino} dinoName={dinoToDelete?.name} />}
    </div>
  );
}

// --- Komponen Kartu Dinosaurus ---
function DinoCard({ dino, onEdit, onDelete }) {
  return (
    <div className="bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/20 transform hover:-translate-y-2 transition-all duration-300 group">
      <img src={dino.imageUrl} alt={dino.name} className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity" />
      <div className="p-5">
        <h3 className="text-2xl font-bold text-cyan-400">{dino.name}</h3>
        <p className="text-gray-400 text-sm mb-4">{dino.era} Period</p>
        
        <div className="space-y-2 text-gray-300">
          <p><span className="font-semibold text-gray-400">Diet:</span> {dino.diet}</p>
          <p><span className="font-semibold text-gray-400">Habitat:</span> {dino.habitat}</p>
        </div>
      </div>
       <div className="p-4 bg-gray-900/30 flex justify-end gap-3">
            <button onClick={() => onEdit(dino)} className="p-2 rounded-full text-blue-400 hover:bg-blue-500/20 transition-colors"><EditIcon /></button>
            <button onClick={() => onDelete(dino)} className="p-2 rounded-full text-red-400 hover:bg-red-500/20 transition-colors"><TrashIcon /></button>
        </div>
    </div>
  );
}

// --- Komponen Modal Tambah/Edit ---
function DinoModal({ dino, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: dino?.name || '',
        era: dino?.era || '',
        diet: dino?.diet || 'Carnivore',
        habitat: dino?.habitat || ''
    });
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

  return (
    <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`bg-gray-800/80 backdrop-blur-xl border border-cyan-500/30 w-full max-w-lg rounded-2xl shadow-2xl shadow-cyan-900/50 relative transform transition-all duration-300 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <header className="p-6 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-cyan-400">{dino ? 'Edit Data Dinosaurus' : 'Tambah Dinosaurus Baru'}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <CloseIcon />
                </button>
            </header>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Input Fields */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nama</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                </div>
                <div>
                    <label htmlFor="era" className="block text-sm font-medium text-gray-300 mb-1">Era</label>
                    <input type="text" name="era" id="era" value={formData.era} onChange={handleChange} required className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                </div>
                <div>
                    <label htmlFor="diet" className="block text-sm font-medium text-gray-300 mb-1">Diet</label>
                    <select name="diet" id="diet" value={formData.diet} onChange={handleChange} className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition">
                        <option>Carnivore</option>
                        <option>Herbivore</option>
                        <option>Omnivore</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="habitat" className="block text-sm font-medium text-gray-300 mb-1">Habitat</label>
                    <input type="text" name="habitat" id="habitat" value={formData.habitat} onChange={handleChange} required className="w-full bg-gray-900/70 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/>
                </div>

                <footer className="pt-4 flex justify-end gap-3">
                     <button type="button" onClick={onClose} className="py-2 px-5 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">Batal</button>
                     <button type="submit" className="py-2 px-5 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold rounded-lg shadow-md shadow-cyan-500/20 transform hover:scale-105 transition-all">Simpan</button>
                </footer>
            </form>
        </div>
    </div>
  );
}


// --- Komponen Modal Konfirmasi Hapus ---
function DeleteConfirmationModal({ onClose, onConfirm, dinoName }) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-gray-800/80 backdrop-blur-xl border border-red-500/30 w-full max-w-md rounded-2xl shadow-2xl shadow-red-900/50 relative transform transition-all duration-300 ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <div className="p-8 text-center">
                    <div className="mx-auto bg-red-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <TrashIcon className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-400">Hapus Data</h3>
                    <p className="text-gray-300 mt-2">
                        Apakah Anda yakin ingin menghapus data untuk <span className="font-bold">{dinoName}</span>? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button onClick={onClose} className="py-2 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors">
                            Batal
                        </button>
                        <button onClick={onConfirm} className="py-2 px-6 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-md shadow-red-500/20 transform hover:scale-105 transition-all">
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
