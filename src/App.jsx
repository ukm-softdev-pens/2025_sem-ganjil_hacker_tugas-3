import { useState, useEffect } from 'react';
// Impor 'db' dari file firebase.js
import { db } from './firebase';
// Impor fungsi-fungsi Firestore
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

function App() {
  // State untuk menyimpan daftar todos
  const [todos, setTodos] = useState([]);
  // State untuk menyimpan nilai input
  const [input, setInput] = useState('');

  // ===== CREATE (Menambah Todo) =====
  const addTodo = async (e) => {
    e.preventDefault(); // Mencegah form refresh halaman
    if (input === '') {
      alert('Masukkan todo terlebih dahulu!');
      return;
    }

    try {
      // 'addDoc' akan menambah dokumen baru ke koleksi "todos"
      await addDoc(collection(db, 'todos'), {
        text: input,
        completed: false,
        timestamp: new Date() // Menambah timestamp untuk pengurutan
      });
      setInput(''); // Kosongkan input setelah berhasil
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // ===== READ (Membaca Todos dari Firebase) =====
  useEffect(() => {
    // Membuat query untuk mengambil data, diurutkan berdasarkan timestamp
    const q = query(collection(db, 'todos'), orderBy('timestamp', 'desc'));

    // 'onSnapshot' mendengarkan perubahan data secara real-time
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        // 'doc.data()' adalah datanya (text, completed)
        // 'doc.id' adalah ID unik dokumen
        todosArray.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArray);
    });

    // Cleanup listener saat komponen di-unmount
    return () => unsubscribe();
  }, []); // [] berarti useEffect ini hanya berjalan sekali saat komponen dimuat

  // ===== UPDATE (Mengubah status completed) =====
  const toggleComplete = async (todo) => {
    try {
      // 'doc' menunjuk ke dokumen spesifik berdasarkan ID
      const todoRef = doc(db, 'todos', todo.id);
      // 'updateDoc' memperbarui field 'completed'
      await updateDoc(todoRef, {
        completed: !todo.completed
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // ===== DELETE (Menghapus Todo) =====
  const deleteTodo = async (id) => {
    try {
      // 'deleteDoc' menghapus dokumen berdasarkan ID
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };


  // ===== JSX (Tampilan dengan Tailwind) =====
  return (
    // Latar belakang abu-abu, tinggi layar penuh, padding
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Kontainer utama, lebar maks, tengah, background putih, shadow, rounded */}
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Todo List (React + Firebase)
        </h1>

        {/* Form untuk menambah todo */}
        <form onSubmit={addTodo} className="flex mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tambahkan todo baru..."
            // Styling input: lebar penuh, padding, border, rounded kiri
            className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            // Styling tombol: background biru, teks putih, padding, rounded kanan, hover
            className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 transition-colors"
          >
            Tambah
          </button>
        </form>

        {/* Daftar Todos */}
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              // Styling list item: flex, justify-between, items-center, padding, bg, shadow
              className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-sm"
            >
              <span
                // Styling teks todo:
                // Jika 'completed' true, tambahkan 'line-through' dan 'text-gray-400'
                className={`cursor-pointer text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                onClick={() => toggleComplete(todo)}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                // Styling tombol hapus: bg merah, teks putih, padding kecil, rounded, hover
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}

export default App;