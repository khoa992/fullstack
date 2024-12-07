const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const validateMovie = require("../middleware/validateMovie");

// Role based access control
router.get("/", authenticateWithRoles(["admin", "regular"]), getAllMovies);

router.get("/:id", authenticate, getMovieById);

// admin routes
router.post("/", authenticateWithRoles(["admin"]), validateMovie, createMovie);

router.put(
  "/:id",
  authenticateWithRoles(["admin"]),
  validateMovie,
  updateMovie
);

router.delete("/:id", authenticateWithRoles(["admin"]), deleteMovie);

function authenticateWithRoles(roles) {
  return (req, res, next) => authenticate(req, res, next, roles);
}

module.exports = router;
