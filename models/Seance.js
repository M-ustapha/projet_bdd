const mongoose = require('mongoose');

const SeanceSchema = new mongoose.Schema({
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    dateTime: { type: Date, required: true }, // Assurez-vous que c'est bien un Date
    room: { type: String, required: true },
    capacity: { type: Number, required: true },
    projectionTechnology: { type: String, required: true },
    ticketPrice: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    onlineAvailability: { type: Boolean, required: true }
});

module.exports = mongoose.model('Seance', SeanceSchema);






