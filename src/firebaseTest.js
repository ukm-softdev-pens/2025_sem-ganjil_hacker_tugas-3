// // src/firebaseTest.js
// import { db } from "./firebase";
// import { collection, getDocs } from "firebase/firestore";

// export async function testFirestoreConnection() {
//   try {
//     const querySnapshot = await getDocs(collection(db, "produk"));
//     console.log("Koneksi Firestore berhasil! Jumlah dokumen:", querySnapshot.size);
//   } catch (error) {
//     console.error("Gagal terhubung ke Firestore:", error);
//   }
// }
