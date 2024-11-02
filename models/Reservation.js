// models/reservation.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Utilisé pour générer des UUID uniques pour chaque réservation

const ReservationSchema = new mongoose.Schema({
    seanceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seance', required: true }, // Référence à la séance
    userId: { type: String, default: uuidv4 }, // UUID unique pour identifier chaque utilisateur
    seatsReserved: { type: [String], required: true }, // Liste de sièges réservés
    reservationDate: { type: Date, default: Date.now } // Date de la réservation
});

// Exporter le modèle de réservation
module.exports = mongoose.model('Reservation', ReservationSchema);
