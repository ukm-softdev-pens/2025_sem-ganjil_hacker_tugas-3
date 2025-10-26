import React, { useState, useEffect, useMemo } from 'react';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    deleteDoc, 
    doc, 
    updateDoc,
    query,
    serverTimestamp
} from 'firebase/firestore';
import './App.css';
import initialFireBase from './firebase.js';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
  </svg>
);

function App() {
    const [savings, setSavings] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const [currentDescription, setCurrentDescription] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [savingsCollectionRef, setSavingsCollectionRef] = useState(null);

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    useEffect(() => {
        try {
            const app = initialFireBase();
            const firestore = getFirestore(app);
            const authInstance = getAuth(app);
            setDb(firestore);
            setAuth(authInstance);

            const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
                if (user) {
                    setUserId(user.uid);
                } else {
                    try {
                        if (typeof __initial_auth_token !== 'undefined') {
                            await signInWithCustomToken(authInstance, __initial_auth_token);
                        } else {
                            await signInAnonymously(authInstance);
                        }
                    } catch (authError) {
                        console.error("Gagal melakukan autentikasi: ", authError);
                        setError("Gagal terhubung ke layanan. Coba muat ulang halaman.");
                    }
                }
            });
            return () => unsubscribe();
        } catch (e) {
            console.error("Gagal inisialisasi Firebase: ", e);
            setError("Gagal memuat aplikasi. Konfigurasi Firebase tidak valid.");
            setLoading(false);
        }
    }, []);

    // --- Setup Listener Firestore ---
    useEffect(() => {
        if (db && userId) {
            const ref = collection(db, 'users');
            setSavingsCollectionRef(ref);

            setLoading(true);
            const q = query(ref);
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const savingsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                savingsData.sort((a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis());
                setSavings(savingsData);
                setLoading(false);
            }, (err) => {
                console.error("Error fetching data:", err);
                setError("Gagal mengambil data tabungan.");
                setLoading(false);
            });

            return () => unsubscribe();
        }
    }, [db, userId, appId]);


    const addSaving = async (e) => {
        e.preventDefault();
        if (!description.trim() || !amount) {
            setError("Deskripsi dan jumlah uang tidak boleh kosong.");
            return;
        }
        if (!savingsCollectionRef) return;
        try {
            await addDoc(savingsCollectionRef, {
                description: description,
                amount: Number(amount),
                timestamp: serverTimestamp()
            });
            setDescription('');
            setAmount('');
            setError('');
        } catch (err) {
            console.error("Error adding document: ", err);
            setError("Gagal menambahkan data.");
        }
    };

    const deleteSaving = async (id) => {
        if (!db) return;
        const docRef = doc(db, 'users', id);
        try {
            await deleteDoc(docRef);
        } catch (err) {
            console.error("Error deleting document: ", err);
            setError("Gagal menghapus data.");
        }
    };
    
    const startEdit = (saving) => {
        setIsEditing(saving.id);
        setCurrentDescription(saving.description);
        setCurrentAmount(saving.amount);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setCurrentDescription('');
        setCurrentAmount('');
    };
    
    const updateSaving = async (e) => {
        e.preventDefault();
        if (!currentDescription.trim() || !currentAmount) {
             setError("Deskripsi dan jumlah uang tidak boleh kosong saat mengedit.");
             return;
        }
        if (!db || !isEditing) return;

        const docRef = doc(db, 'users', isEditing);
        try {
            await updateDoc(docRef, {
                description: currentDescription,
                amount: Number(currentAmount)
            });
            cancelEdit();
            setError('');
        } catch (err) {
            console.error("Error updating document: ", err);
            setError("Gagal memperbarui data.");
        }
    };

    const totalSavings = useMemo(() => {
        return savings.reduce((total, item) => total + item.amount, 0);
    }, [savings]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <>
            <div className="main-wrapper">
                <div className="app-container">
                    <header className="app-header">
                        <h1>Buku Tabungan Digital</h1>
                        <p>Catat pemasukan uang Anda dengan mudah!</p>
                    </header>

                    {error && <div className="error-message">{error}</div>}

                    <div className="card">
                        <h2>Tambah Pemasukan Baru</h2>
                        <form onSubmit={addSaving} className="add-form">
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Contoh: Gaji bulan ini"
                            />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Jumlah (Rp)"
                            />
                            <button type="submit">
                                <PlusIcon /> <span style={{marginLeft: '8px'}}>Tambah</span>
                            </button>
                        </form>
                    </div>
                    
                    <div className="total-savings-card">
                        <h3>Total Tabungan Anda</h3>
                        <p>{formatCurrency(totalSavings)}</p>
                    </div>

                    <div className="card savings-list">
                        <h2>Riwayat Pemasukan</h2>
                        {loading ? (
                            <p>Memuat data...</p>
                        ) : savings.length > 0 ? (
                            <ul>
                                {savings.map((saving) => (
                                    <li key={saving.id}>
                                        {isEditing === saving.id ? (
                                            <form onSubmit={updateSaving} className="edit-form">
                                                <input
                                                    type="text"
                                                    value={currentDescription}
                                                    onChange={(e) => setCurrentDescription(e.target.value)}
                                                />
                                                <input
                                                    type="number"
                                                    value={currentAmount}
                                                    onChange={(e) => setCurrentAmount(e.target.value)}
                                                />
                                                <div className="edit-actions">
                                                    <button type="submit" className="save-btn">Simpan</button>
                                                    <button type="button" onClick={cancelEdit} className="cancel-btn">Batal</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="saving-item">
                                                <div className="info">
                                                    <p className="description">{saving.description}</p>
                                                    <p className="amount">{formatCurrency(saving.amount)}</p>
                                                </div>
                                                <div className="actions">
                                                    <button onClick={() => startEdit(saving)}>
                                                        <EditIcon />
                                                    </button>
                                                    <button onClick={() => deleteSaving(saving.id)} className="delete-btn">
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Belum ada data pemasukan. Silakan tambahkan.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;

