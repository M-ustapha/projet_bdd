// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    userName: {
        type: String,
        required: false // Name is optional
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: false // Rating is optional
    },
    comment: {
        type: String,
        required: false // Comment is optional
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', reviewSchema);
