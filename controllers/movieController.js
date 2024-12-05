const Movie = require('../models/movieModel');
const Joi = require('joi');

const movieSchema = Joi.object({
    title: Joi.string().min(1).required(),
    year: Joi.number().integer().min(1888).required(),
    director: Joi.string().min(1).required(),
});


const getAllMovies = async (req, res) => {
    try {
        const query = {};
        if (req.query.title) query.title = { $regex: req.query.title, $options: 'i' };
        if (req.query.year) query.year = parseInt(req.query.year);
        if (req.query.director) query.director = { $regex: req.query.director, $options: 'i' };
        const movie = await Movie.find(query);
        res.json(movie);
    } catch (err) {
        res.status(500).send('Error fetching movies');
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) res.json(movie);
        else res.status(404).send('Movie not found');
    } catch (err) {
        res.status(500).send('Error fetching movie');
    }
};

const createMovie = async (req, res) => {
    try {
        const error = movieSchema.validate(req.body).error;
        if (error) return res.status(400).json({ error: error.details.map((err) => err.message) });

        const newMovie = new Movie(req.body);
        await newMovie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(500).send('Error adding movie');
    }
};

const updateMovie = async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedMovie) return res.status(404).send('Movie not found');
        res.json(updatedMovie);
    } catch (err) {
        res.status(500).send('Error updating movie');
    }
};

const deleteMovie = async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) return res.status(404).send('Movie not found');
        res.json(deletedMovie);
    } catch (error) {
        res.status(500).send('Error deleting movie');
    }  
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
};