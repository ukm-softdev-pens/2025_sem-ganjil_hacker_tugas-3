import { useState } from "react";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const AddProduct = ({ onClose }) => {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [kategori, setKategori] = useState("");
  const [stok, setStok] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambarUrl, setGambarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // mengatur data yang disimpan
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !harga || !kategori || !stok || !deskripsi || !gambarUrl)
      return alert("Lengkapi semua field!");

    setLoading(true);
    try {
      await addDoc(collection(db, "produk"), {
        nama,
        harga: parseFloat(harga),
        kategori,
        stok,
        deskripsi,
        gambarUrl,
        tanggal_ditambah: serverTimestamp(),
      });

      alert("Produk berhasil ditambahkan!");
      setNama("");
      setHarga("");
      setKategori("");
      setStok("");
      setDeskripsi("");
      setGambarUrl("");
      onClose(); // otomatis tutup modal setelah berhasil
    } catch (err) {
      console.error("Error adding product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // mengatur posisi card
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      {/* card utama */}
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Tambah Produk
        </h2>

        {/* form tambah prduk */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nama produk"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="number"
            placeholder="Harga"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="text"
            placeholder="Kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="number"
            placeholder="Stok"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <input
            type="text"
            placeholder="URL Online Gambar"
            value={gambarUrl}
            onChange={(e) => setGambarUrl(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <textarea
            placeholder="Deskripsi produk"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded ${
              loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Mengunggah..." : "Tambah Produk"}
          </button>
        </form>

        {/* tombol menutup pop up */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
