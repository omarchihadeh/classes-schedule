const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    registrationId: { type: String, default: uuidv4, unique: true },
    studentId: { type: Number, required: true },
    instructorId: { type: Number, required: true },
    classId: { type: Number, required: true },
    date: { type: Date, required: true },
    action: { type: String, required: true }
}, {
    timestamps: true,
});

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
