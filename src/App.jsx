import db from './firebase.js'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'

import './App.css'
import Table from './component/table.jsx'
import ModalCreate from './component/ModalCreate.jsx'
import ModalEdit from './component/ModalEdit.jsx'

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, "buku"));
      const result = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(result);
    })();
  }, []);

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', author: '', year: '' });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, "buku", id));

        (async () => {
          const querySnapshot = await getDocs(collection(db, "buku"));
          const result = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(result);
        })();
      } catch (error) {
        console.error("Gagal menghapus data:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await (async () => addDoc(collection(db, 'buku'), {
        title: formData.title,
        author: formData.author,
        year: formData.year,
      }))();

      (async () => {
        const querySnapshot = await getDocs(collection(db, "buku"));
        const result = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(result);
      })();

      setFormData({ title: '', author: '', year: '' });
      setIsModalCreateOpen(false);
    } catch (error) {
      console.error('Error adding document:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formDataEdit, setFormDataEdit] = useState({ title: '', author: '', year: '' })

  const handleEdit = (item) => {
    setFormDataEdit({
      title: item.title,
      author: item.author,
      year: item.year,
    });
    setSelectedId(item.id);
    setIsModalEditOpen(true);
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'buku', selectedId), {
        title: formData.title,
        author: formData.author,
        year: formData.year,
      });

      const querySnapshot = await getDocs(collection(db, "buku"));
      const result = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setData(result);

      setIsModalEditOpen(false);
      setFormData({ title: '', author: '', year: '' });
    } catch (error) {
      console.error('Error updating document:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center bg-gray-100 p-10">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className='flex justify-between mb-6'>
            <h1 className="text-2xl font-bold text-amber-900">BOOKBASE</h1>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold flex items-center gap-2 text-md" onClick={() => setIsModalCreateOpen(true)}>
              <Plus size={20} />
              Add
            </button>
          </div>
          <Table data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
        </div>
      </div>

      <ModalCreate isOpen={isModalCreateOpen} onClose={() => setIsModalCreateOpen(false)} handleSubmit={handleSubmit} formData={formData} handleInputChange={handleInputChange} />
      <ModalEdit
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        handleSubmit={handleEditSubmit}
        formData={formDataEdit}
        handleInputChange={handleInputChange}
      />
    </>
  )
}