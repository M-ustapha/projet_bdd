const express = require('express');
const router = express.Router();
const Movie = require('./models/Movie');
const Seance = require('./models/Seance');
const multer = require('multer');
const path = require('path');
const Review = require('./models/Review'); // Add this line






// Configuration de multer pour gérer les images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// Route principale
//router.get('/', async (req, res) => {
//    try {
//        const movies = await Movie.find();
//        const reviews = await Review.find(); // Fetch all reviews
//        res.render('index', { movies, reviews }); // Pass both movies and reviews to the view
//    } catch (error) {
//        console.error(error);
//        res.status(500).send('Erreur lors de la récupération des films et des avis.');
//    }
//});


// Route principale pour afficher tous les films avec la note moyenne
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.aggregate([
            {
                $addFields: {
                    averageRating: { $avg: "$reviews.rating" } // Calcul de la note moyenne
                }
            }
        ]);

        res.render('index', { movies }); // On passe "movies" dans la vue, sans "reviews" séparé
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur lors de la récupération des films avec la note moyenne");
    }
});


// Formulaire pour ajouter un film
router.get('/movies/new', (req, res) => {
    res.render('addMovie');
});

// Affiche les séances d'un film spécifique
router.get('/seances/movie/:id', async (req, res) => {
    const movieId = req.params.id;
    try {
        const sessions = await Seance.find({ movieId: movieId }).populate('movieId');
        // Convertir dateTime en objet Date si nécessaire
        sessions.forEach(session => {
            session.dateTime = new Date(session.dateTime);
        });
        res.render('sessions', { sessions });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération des séances.');
    }
});

router.post('/seances', async (req, res) => {
    const { movieId, dateTime, room, capacity, projectionTechnology, ticketPrice, availableSeats, onlineAvailability } = req.body;

    try {
        const newSeance = new Seance({
            movieId,
            dateTime: new Date(dateTime), // Assurez-vous que cela soit une date valide
            room,
            capacity,
            projectionTechnology,
            ticketPrice: parseFloat(ticketPrice), // Convertir le prix en nombre à virgule flottante
            availableSeats,
            onlineAvailability: onlineAvailability === 'true' // Convertir en booléen
        });
        
        await newSeance.save();
        res.redirect('/'); // Rediriger vers la liste des films
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'ajout de la séance.');
    }
});


// Ajouter un film (POST)
router.post('/movies', upload.single('poster'), async (req, res) => {
    const { title, releaseYear, duration, genre, director, actors, synopsis, classification, language, trailer, format, productionStudio, releaseDate } = req.body;
    const poster = req.file ? `/images/${req.file.filename}` : '';

    const movie = new Movie({
        title,
        releaseYear,
        duration,
        genre,
        director,
        actors: actors.split(',').map(actor => actor.trim()),
        synopsis,
        classification,
        language,
        trailer,
        poster,
        format,
        productionStudio,
        releaseDate
    });

    await movie.save();
    res.redirect('/');
});

// Formulaire pour modifier un film
router.get('/movies/edit/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
res.render('editMovie', { movie });
});


// Modifier un film (POST)
router.post('/movies/edit/:id', upload.single('poster'), async (req, res) => {
    const { title, releaseYear, duration, genre, director, actors, synopsis, classification, language, trailer, format, productionStudio, releaseDate } = req.body;
    const poster = req.file ? `/images/${req.file.filename}` : '';

    const movie = await Movie.findById(req.params.id);
    movie.title = title;
    movie.releaseYear = releaseYear;
    movie.duration = duration;
    movie.genre = genre;
    movie.director = director;
    movie.actors = actors.split(',').map(actor => actor.trim());
    movie.synopsis = synopsis;
    movie.classification = classification;
    movie.language = language;
    movie.trailer = trailer;
    movie.poster = poster || movie.poster; // Garde l'ancien poster si aucun nouveau n'est fourni
    movie.format = format;
    movie.productionStudio = productionStudio;
    movie.releaseDate = releaseDate;

    await movie.save();
    res.redirect('/');
});

// Supprimer un film
router.post('/movies/delete/:id', async (req, res) => {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// Formulaire pour ajouter une séance
router.get('/seances/new', async (req, res) => {
    const movies = await Movie.find();
    res.render('addSeance', { movies });
});
// Ajoute un avis pour un film
router.post('/movies/:id/review', async (req, res) => {
    const { userName, rating, comment } = req.body;
    const movieId = req.params.id;

    try {
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).send('Film non trouvé');

        // Ajouter un nouvel avis dans le tableau des avis intégrés
        movie.reviews.push({ userName: userName || 'Anonymous', rating, comment });
        await movie.save();

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de l\'ajout de l\'avis');
    }
});
// Route pour obtenir la note moyenne d'un film
router.get('/movies/:id/average-rating', async (req, res) => {
    const movieId = req.params.id;

    try {
        const averageRating = await Movie.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(movieId) } },
            { $unwind: "$reviews" },
            { $group: { _id: "$_id", averageRating: { $avg: "$reviews.rating" } } }
        ]);

        if (averageRating.length > 0) {
            res.json({ averageRating: averageRating[0].averageRating });
        } else {
            res.json({ averageRating: null });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors du calcul de la note moyenne');
    }
});


module.exports = router;
