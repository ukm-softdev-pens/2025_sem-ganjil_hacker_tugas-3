// src/components/Edit.jsx
import { useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Edit({ data, onClose, onSaved }) {
  // gunakan local state agar tidak memodifikasi props langsung
    const [form, setForm] = useState({
        nama: "",
        harga: "",
        kategori: "",
        stok: "",
        gambarUrl: "",
        deskripsi: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data) {
        setForm({
            nama: data.nama || "",
            harga: data.harga ?? "",
            kategori: data.kategori || "",
            stok: data.stok ?? "",
            gambarUrl: data.gambarUrl || "",
            deskripsi: data.deskripsi || "",
        });
        }
    }, [data]);

    const handleChange = (key, val) => setForm((s) => ({ ...s, [key]: val }));

    // mengatur penyimpanan perubahan
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        const docRef = doc(db, "produk", data.id);
        await updateDoc(docRef, {
            nama: form.nama,
            harga: parseFloat(form.harga) || 0,
            kategori: form.kategori,
            stok: Number(form.stok) || 0,
            gambarUrl: form.gambarUrl,
            deskripsi: form.deskripsi,
        });
        onSaved && onSaved();
        } catch (err) {
        console.error("update error:", err);
        alert("Gagal menyimpan perubahan.");
        } finally {
        setLoading(false);
        }
    };

    return (
        // mengatur posisi card
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            {/* form edit data + card */}
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white rounded-xl p-6 shadow-xl animate-fade-in">
                <h3 className="text-lg font-semibold text-indigo-700 mb-4">Edit Produk</h3>

                {/* form edit */}
                <div className="grid grid-cols-1 gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-gray-600">Nama</label>
                            <input value={form.nama} onChange={(e) => handleChange("nama", e.target.value)}
                                className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Harga (Rp)</label>
                            <input type="number" value={form.harga} onChange={(e) => handleChange("harga", e.target.value)}
                                className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                        <label className="text-sm text-gray-600">Kategori</label>
                        <input value={form.kategori} onChange={(e) => handleChange("kategori", e.target.value)}
                            className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                        </div>
                        <div>
                        <label className="text-sm text-gray-600">Stok</label>
                        <input type="number" value={form.stok} onChange={(e) => handleChange("stok", e.target.value)}
                            className="w-full border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                        </div>
                    </div>

                    <label className="text-sm text-gray-600">URL Gambar (opsional)</label>
                    <input value={form.gambarUrl} onChange={(e) => handleChange("gambarUrl", e.target.value)}
                        className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" />

                    <label className="text-sm text-gray-600">Deskripsi</label>
                    <textarea value={form.deskripsi} onChange={(e) => handleChange("deskripsi", e.target.value)}
                        rows={3} className="border border-gray-200 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>

                <div className="flex justify-end gap-3 mt-5">
                    {/* tombol tutup */}
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Batal</button>

                    {/* tombol simpan perubahan data */}
                    <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </form>
        </div>
    );
}
