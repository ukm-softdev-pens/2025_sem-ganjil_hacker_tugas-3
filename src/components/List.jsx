// src/components/List.jsx
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import Edit from "./Edit";
import Detail from "./Detail";
import AddProduct from "./AddProduct";

export default function List() {
  const [produk, setProduk] = useState([]);
  const [editData, setEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [addData, setAddData] = useState(false);

  // fetch data produk secara real-time
  useEffect(() => {
    const q = query(collection(db, "produk"), orderBy("tanggal_ditambah", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProduk(data);
    }, (err) => {
      console.error("snapshot error:", err);
    });
    return () => unsub();
  }, []);

  // hapus produk
  const handleDelete = async (id) => {
    const ok = confirm("Yakin ingin menghapus produk ini?");
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "produk", id));
      // onSnapshot akan otomatis update UI
    } catch (err) {
      console.error("delete error:", err);
      alert("Gagal menghapus produk.");
    }
  };

  // detail produk
  const handleDetail = async (id) => {
    try {
      const docRef = doc(db, "produk", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) setDetailData({ id: snap.id, ...snap.data() });
      else alert("Produk tidak ditemukan.");
    } catch (err) {
      console.error("detail error:", err);
    }
  };

  return (
    // card daftar produk
    <div className="max-w-5xl mx-auto mt-5 p-6 bg-white rounded-2xl shadow-md text-gray-800">
      <h1 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">Daftar Produk</h1>

      <div className="overflow-x-auto rounded-t-lg">
        {/* tabel data */}
        <table className="w-full table-auto border-collapse overflow-hidden">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-3 text-left">Gambar</th>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Harga</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {produk.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">Belum ada produk.</td>
              </tr>
            ) : (
              produk.map((p) => (
                <tr key={p.id} className="text-left align-top border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-3">
                    {p.gambarUrl ? (
                      <img src={p.gambarUrl} alt={p.nama} className="w-16 h-16 object-cover rounded-md" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400">No Img</div>
                    )}
                  </td>
                  <td className="p-3">{p.nama}</td>
                  <td className="p-3">Rp {Number(p.harga || 0).toLocaleString("id-ID")}</td>
                  <td className="p-3">{p.kategori}</td>
                  <td className="p-3 text-center align-top space-x-2">

                      {/* Tombol detail produk */}
                    <button
                      onClick={() => handleDetail(p.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
                      title="Detail"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    </button>

                      {/* Tombol edit produk */}
                    <button
                      onClick={() => setEditData(p)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-400 text-white hover:bg-yellow-500 transition"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>

                      {/* Tombol delete produk */}
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                      title="Hapus"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Tombol tambah produk */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setAddData(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tambah Produk
          </button>
        </div>
        
      </div>

      {/* Edit modal */}
      {editData && (
        <Edit
          data={editData}
          onClose={() => setEditData(null)}
          onSaved={() => setEditData(null)}
        />
      )}

      {/* Detail modal */}
      {detailData && (
        <Detail
          data={detailData}
          onClose={() => setDetailData(null)}
        />
      )}

      {/* Add data modal */}
      {addData && 
        <AddProduct 
          onClose={() => setAddData(false)} 
        />
      }

    </div>
  );
}
