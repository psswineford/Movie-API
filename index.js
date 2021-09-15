const { response } = require('express');
const express = require('express'),
    morgan = require('morgan');

const app = express();

// serve files with express static 
app.use(express.static('public'));

// Log all requests utlizing Morgan
app.use(morgan('common'));

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//create array of information on top movies
let topMovies = [
    {
        title: 'Star Wars',
        director: 'George Lucas'
    },
    {
        title: 'The Crow',
        director: 'Alex Proyas'
    },
    {
        title: 'The Matrix',
        director: 'The Wachoskis'
    },
    {
        title: 'Lord of the Rings',
        director: 'Peter Jackson'
    },
    {
        title: 'Aliens',
        director: 'James Cameron'
    },
    {
        title: 'Raiders of the Lost Ark',
        director: 'Steven Spielberg'
    },
    {
        title: 'Braveheart',
        director: 'Mel Gibson'
    },
    {
        title: 'Dark Knight',
        director: 'Christopher Nolan'
    },
    {
        title: 'Sprited Away',
        director: 'Hayao Miyazaki'
    },
    {
        title: 'Back to the Future',
        director: 'Robert Zemeckis'
    }
];

//GET requests
app.get('/', (req,res) => {
    res.send('Welcome to my Movie List!');    
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app  is listening on port 8080.');
});
