// src/components/Detail.jsx
export default function Detail({ data, onClose }) {
  // mengatur format tanggal
  const formatDate = (ts) => {
    if (!ts) return "-";
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString("id-ID");
    if (ts instanceof Date) return ts.toLocaleString("id-ID");
    return String(ts);
  };

  return (
    // mengatur posisi card
    <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      {/* card utama */}
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl animate-fade-in">
        <h3 className="text-lg font-semibold text-indigo-700 mb-4 text-center">
          Detail Produk
        </h3>

        {/* Gambar di atas tengah */}
        <div className="flex justify-center mb-6">
          {data.gambarUrl ? (
            <img
              src={data.gambarUrl}
              alt={data.nama}
              className="w-40 h-40 object-cover rounded-md shadow-sm"
            />
          ) : (
            <div className="w-40 h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        {/* Table informasi produk */}
        <table className="w-full text-left table-auto border-collapse text-gray-700 mb-6">
          <tbody>
            <tr className="border-b">
              <td className="font-medium p-2 w-1/3">Nama</td>
              <td className="p-2">{data.nama}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2">Harga</td>
              <td className="p-2">Rp {Number(data.harga || 0).toLocaleString("id-ID")}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2">Kategori</td>
              <td className="p-2">{data.kategori}</td>
            </tr>
            <tr className="border-b">
              <td className="font-medium p-2">Stok</td>
              <td className="p-2">{data.stok ?? "-"}</td>
            </tr>
            {data.deskripsi && (
              <tr className="border-b">
                <td className="font-medium p-2">Deskripsi</td>
                <td className="p-2">{data.deskripsi}</td>
              </tr>
            )}
            <tr>
              <td className="font-medium p-2">Ditambahkan</td>
              <td className="p-2">{formatDate(data.tanggal_ditambah)}</td>
            </tr>
          </tbody>
        </table>

        {/* Tombol Tutup */}
        <div className="flex justify-end">
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
}
