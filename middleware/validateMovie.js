const Joi = require('joi');
const MovieValidationSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1888).required(),
    director: Joi.string().required(),
});

const validateMovie = (req, res, next) => {
    const { error } = MovieValidationSchema.validate(req.body);
    if (error) {
        const errMess = error.details.map((err) => err.message);
        return res.status(400).json({ error: errMess });
    }
    next();
}

module.exports = validateMovie;