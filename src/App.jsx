import React, { useState, useEffect } from "react";
import { db } from "./firebase"; // Import Firestore database instance

import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [plate, setPlate] = useState("");
  const [vehicleType, setVehicleType] = useState("car");
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const PARKING_CAPACITY = 100;

  useEffect(() => {
    const ticketsCollection = collection(db, "tickets");
    const q = query(ticketsCollection, orderBy("entryTime", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        entryTime: doc.data().entryTime?.toDate().toLocaleString(),
      }));
      setTickets(ticketsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Reset Form Function ---
  const resetForm = () => {
    setEditingTicketId(null);
    setPlate("");
    setVehicleType("car");
  };

  // --- Create/Update Data ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plate) return;

    if (editingTicketId) {
      const ticketDoc = doc(db, "tickets", editingTicketId);
      await updateDoc(ticketDoc, { plate, vehicleType });
    } else {
      await addDoc(collection(db, "tickets"), {
        plate,
        vehicleType,
        entryTime: serverTimestamp(),
      });
    }
    resetForm();
  };

  const handleEdit = (ticket) => {
    setEditingTicketId(ticket.id);
    setPlate(ticket.plate);
    setVehicleType(ticket.vehicleType);
  };

  // --- Delete Data ---
  const handleDelete = async (id) => {
    const ticketDoc = doc(db, "tickets", id);
    await deleteDoc(ticketDoc);
  };

  // --- Cancel Edit ---
  const handleCancelEdit = () => {
    resetForm();
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans">
      <div className="container mx-auto max-w-2xl p-4">
        {/* --- Header & Counter --- */}
        <header className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-4xl font-bold text-slate-800">
            Parkir KTM Online
          </h1>
          <p className="text-slate-500">
            Manajemen kapasitas parkir kendaraan di area kampus.
          </p>
          <div className="mt-4 bg-blue-100 text-blue-800 font-bold text-2xl p-4 rounded-lg text-center">
            Kapasitas: {tickets.length} / {PARKING_CAPACITY}
          </div>
        </header>

        {/* --- Form for Create/Update --- */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            {editingTicketId ? "Edit Tiket" : "Tambah Tiket"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="Lisensi Plat Nomor"
                className="flex-grow p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="car">Mobil</option>
                <option value="bike">Motor</option>
                <option value="truck">Truk</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className={`flex-1 px-4 py-2 text-white font-semibold rounded-md shadow-sm transition-transform transform hover:-translate-y-0.5 ${
                  editingTicketId
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {editingTicketId ? "Update Ticket" : "Add Ticket"}
              </button>

              {/* --- NEW CANCEL BUTTON --- */}
              {editingTicketId && (
                <button
                  type="button" // Important: type="button" to not submit the form
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- List of Tickets --- */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-700">
            List Tiket
          </h2>
          {isLoading ? (
            <p className="text-slate-500">Loading tickets...</p>
          ) : (
            <ul className="space-y-3">
              {tickets.map((ticket) => (
                <li
                  key={ticket.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div>
                    <p className="font-bold text-slate-800 text-lg uppercase">
                      {ticket.plate}
                    </p>
                    <p className="text-slate-500 text-sm">
                      Type:{" "}
                      <span className="font-semibold capitalize">
                        {ticket.vehicleType}
                      </span>{" "}
                      | Entry: {ticket.entryTime}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <button
                      onClick={() => handleEdit(ticket)}
                      className="px-3 py-1 bg-yellow-400 text-yellow-900 font-semibold rounded-md text-sm hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="px-3 py-1 bg-red-500 text-white font-semibold rounded-md text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
