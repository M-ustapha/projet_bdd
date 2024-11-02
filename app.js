const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');


const app = express();
const PORT = 3000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost/movieApp', { useNewUrlParser: true, useUnifiedTopology: true });

// Configurations
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// Routes
app.use('/', routes);
app.use(bodyParser.json()); // Assurez-vous d'utiliser json pour le traitement des requêtes JSON


// Lancement du serveur
app.listen(PORT, () => {
    console.log(`Le serveur est démarré sur le port ${PORT}`);
});
