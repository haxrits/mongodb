const Room = require('../models/Room');

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single room
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new room
exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, building, rows, columns, seatsPerBench = 2, floor = 1 } = req.body;

    if (!roomNumber || !building || !rows || !columns) {
      return res.status(400).json({
        success: false,
        message: 'roomNumber, building, rows, and columns are required',
      });
    }

    const existing = await Room.findOne({ roomNumber: roomNumber.trim().toUpperCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Room "${roomNumber}" already exists`,
      });
    }

    const capacity = Number(rows) * Number(columns) * Number(seatsPerBench);

    const room = await Room.create({
      roomNumber: roomNumber.trim().toUpperCase(),
      building: building.trim(),
      rows: Number(rows),
      columns: Number(columns),
      seatsPerBench: Number(seatsPerBench),
      capacity,
      floor: Number(floor),
    });

    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update room
exports.updateRoom = async (req, res) => {
  try {
    const { roomNumber, building, rows, columns, seatsPerBench, floor } = req.body;

    if (roomNumber) {
      const duplicate = await Room.findOne({
        roomNumber: roomNumber.trim().toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: `Room "${roomNumber}" already exists`,
        });
      }
    }

    const existingRoom = await Room.findById(req.params.id);
    if (!existingRoom) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    const newRows = rows !== undefined ? Number(rows) : existingRoom.rows;
    const newCols = columns !== undefined ? Number(columns) : existingRoom.columns;
    const newSeatsPerBench = seatsPerBench !== undefined ? Number(seatsPerBench) : existingRoom.seatsPerBench;
    const newCapacity = newRows * newCols * newSeatsPerBench;

    const updated = await Room.findByIdAndUpdate(
      req.params.id,
      {
        ...(roomNumber && { roomNumber: roomNumber.trim().toUpperCase() }),
        ...(building && { building: building.trim() }),
        rows: newRows,
        columns: newCols,
        seatsPerBench: newSeatsPerBench,
        capacity: newCapacity,
        ...(floor !== undefined && { floor: Number(floor) }),
      },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const deleted = await Room.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
