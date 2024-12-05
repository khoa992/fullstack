const mongoose = require('mongoose');

const movieScheme = new mongoose.Schema({
    title: { type: String, required: true },
    year: {
        type: Number,
        required: true,
        min: 1888,
    },
    director: { type: String, required: true },
});

const Movie = mongoose.model('Movie', movieScheme);

module.exports = Movie;