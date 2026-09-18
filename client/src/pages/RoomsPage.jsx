import React, { useState, useEffect } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  Grid,
  Layers,
  X,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';

export default function RoomsPage({ showToast, onDataChange }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: 'Main Academic Block',
    rows: 5,
    columns: 6,
    seatsPerBench: 2,
    floor: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await api.getRooms();
      if (res.success) {
        setRooms(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const calculatedCapacity = (formData.rows || 0) * (formData.columns || 0) * (formData.seatsPerBench || 2);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await api.createRoom(formData);
      if (res.success) {
        showToast(`Room ${res.data.roomNumber} created with capacity ${res.data.capacity}`, 'success');
        setIsAddModalOpen(false);
        setFormData({
          roomNumber: '',
          building: 'Main Academic Block',
          rows: 5,
          columns: 6,
          seatsPerBench: 2,
          floor: 1,
        });
        fetchRooms();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!selectedRoom) return;
    try {
      setIsSubmitting(true);
      const res = await api.updateRoom(selectedRoom._id, formData);
      if (res.success) {
        showToast(`Room ${res.data.roomNumber} updated successfully`, 'success');
        setIsEditModalOpen(false);
        fetchRooms();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id, roomNum) => {
    if (!window.confirm(`Are you sure you want to delete room ${roomNum}?`)) return;
    try {
      const res = await api.deleteRoom(id);
      if (res.success) {
        showToast(`Room ${roomNum} deleted`, 'success');
        fetchRooms();
        if (onDataChange) onDataChange();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 className="h-6 w-6 text-emerald-400" />
            <span>Examination Rooms</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure examination halls, bench matrix dimensions, and automatic capacity calculations.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              roomNumber: '',
              building: 'Main Academic Block',
              rows: 5,
              columns: 6,
              seatsPerBench: 2,
              floor: 1,
            });
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Rooms Cards Grid */}
      {loading ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-500">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-emerald-500" />
          <p className="mt-2 text-xs">Loading rooms from MongoDB Atlas...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-400">
          No examination rooms configured yet. Click "LOAD DEMO DATA" or "Add New Room".
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-sm transition-all hover:border-slate-700 hover:shadow-xl"
            >
              {/* Top Room Badge & Actions */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
                    Floor {room.floor}
                  </span>
                  <h3 className="mt-2 text-xl font-extrabold text-white tracking-tight">
                    {room.roomNumber}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{room.building}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSelectedRoom(room);
                      setFormData({
                        roomNumber: room.roomNumber,
                        building: room.building,
                        rows: room.rows,
                        columns: room.columns,
                        seatsPerBench: room.seatsPerBench || 2,
                        floor: room.floor || 1,
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                    title="Edit Room"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Room"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Room Geometry Specs */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 text-center">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Rows</span>
                  <p className="font-mono text-base font-bold text-slate-200 mt-0.5">{room.rows}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Benches/Row</span>
                  <p className="font-mono text-base font-bold text-slate-200 mt-0.5">{room.columns}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Seats/Bench</span>
                  <p className="font-mono text-base font-bold text-slate-200 mt-0.5">{room.seatsPerBench || 2}</p>
                </div>
              </div>

              {/* Capacity Banner */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-950/60 p-3.5 border border-emerald-500/20">
                <span className="text-xs font-semibold text-slate-300">Total Calculated Capacity</span>
                <span className="text-lg font-extrabold text-emerald-400 font-mono">
                  {room.capacity} Seats
                </span>
              </div>

              {/* Mini Bench Grid Preview */}
              <div className="mt-4 border-t border-slate-800 pt-3">
                <p className="text-[10px] uppercase font-semibold text-slate-400 mb-2">Hall Grid Schema</p>
                <div className="flex flex-col gap-1 items-center bg-slate-950/40 p-2 rounded-lg border border-slate-800/50">
                  {Array.from({ length: Math.min(room.rows, 4) }).map((_, r) => (
                    <div key={r} className="flex gap-1.5">
                      {Array.from({ length: Math.min(room.columns, 6) }).map((_, c) => (
                        <div
                          key={c}
                          className="h-2 w-4 rounded-xs bg-slate-700/60 border border-slate-600/40"
                          title={`Bench Row ${r + 1}, Col ${c + 1}`}
                        ></div>
                      ))}
                    </div>
                  ))}
                  {room.rows > 4 && (
                    <span className="text-[9px] text-slate-400 font-mono">+ {room.rows - 4} more rows</span>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create New Exam Room</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateRoom} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Number / Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LH-103 or AUDITORIUM-A"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white uppercase focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Building Name</label>
                <input
                  type="text"
                  required
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rows (1-20)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.rows}
                    onChange={(e) => setFormData({ ...formData, rows: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.columns}
                    onChange={(e) => setFormData({ ...formData, columns: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seats/Bench</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    required
                    value={formData.seatsPerBench}
                    onChange={(e) => setFormData({ ...formData, seatsPerBench: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Floor Number</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Calculated Capacity Display */}
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                <span className="text-xs text-emerald-300">
                  Calculated Capacity: <strong className="text-emerald-400 font-mono text-base">{calculatedCapacity}</strong> students
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  ({formData.rows || 0} rows × {formData.columns || 0} columns × {formData.seatsPerBench || 2} students/bench)
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Room</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateRoom} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white uppercase focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Building</label>
                <input
                  type="text"
                  required
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.rows}
                    onChange={(e) => setFormData({ ...formData, rows: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={formData.columns}
                    onChange={(e) => setFormData({ ...formData, columns: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Seats/Bench</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    required
                    value={formData.seatsPerBench}
                    onChange={(e) => setFormData({ ...formData, seatsPerBench: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Floor</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Calculated Capacity Display */}
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-center">
                <span className="text-xs text-emerald-300">
                  New Capacity: <strong className="text-emerald-400 font-mono text-base">{calculatedCapacity}</strong> students
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Updating...' : 'Update Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
