// models/Movie.js
const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    userName: { type: String, default: 'Anonymous' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
}, { strict: false }); // Autorise des champs dynamiques

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    releaseYear: Number,
    duration: Number,
    genre: String,
    director: String,
    actors: [String],
    synopsis: String,
    classification: String,
    language: String,
    trailer: String,
    poster: String,
    format: String,
    productionStudio: String,
    releaseDate: Date,
    reviews: [reviewSchema] // Intégration des avis directement dans le film
});
// Ajouter l'index pour reviews.rating
movieSchema.index({ 'reviews.rating': 1 });

module.exports = mongoose.model('Movie', movieSchema);
