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
        genre: 'Science Fiction',
        director: 'George Lucas'
    },
    {
        title: 'The Crow',
        genre: 'Science Fiction',
        director: 'Alex Proyas'
    },
    {
        title: 'The Matrix',
        genre: 'Science Fiction',
        director: 'The Wachoskis'
    },
    {
        title: 'Lord of the Rings',
        genre: 'Fantasy',
        director: 'Peter Jackson'
    },
    {
        title: 'Aliens',
        genre: 'Science Fiction',
        director: 'James Cameron'
    },
    {
        title: 'Raiders of the Lost Ark',
        genre: 'Action',
        director: 'Steven Spielberg'
    },
    {
        title: 'Braveheart',
        genre: 'Drama',
        director: 'Mel Gibson'
    },
    {
        title: 'Dark Knight',
        genre: 'Comic book',
        director: 'Christopher Nolan'
    },
    {
        title: 'Sprited Away',
        genre: 'Animiated',
        director: 'Hayao Miyazaki'
    },
    {
        title: 'Back to the Future',
        genre: 'Science Fiction',
        director: 'Robert Zemeckis'
    }
];

let users = [
    {
        ID: 1,
        Name: 'Shawn Swineford',
        Age: '46',
        Favorite_Movies: [
            {
                Title: 'Star Wars'
            },
            {
                Title: 'Lord of the Rings'
            }
        ]
    }
]

//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my Movie List!');
});
// return all movies
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

//return movies by name
app.get('/movies/:title', (req, res) => {
    res.json(topMovies.find((topMovies) => { return topMovies.title === req.params.title }));
});

//return movies by genre
app.get('/genre/:title', (req, res) => {
    res.send('Successful GET requests returning genre data');
});

//return movies by director
app.get('/director/:title', (req, res) => {
    res.send('Successful GET requests returning director Data');
});

//return all users
app.get('/users', (req, res) => {
    res.json(users);
});

//add user
app.post('/users', (req, res) => {
    res.status(201).send('Successfully added user');
});

//delete user
app.delete('/users/:name', (req, res) => {
    res.status(201).send('Successfully removed user');
});

//add Favorite Movies to users
app.post('/users/:id/movies/:title', (req, res) => {
    res.status(201).send('Successfully added favorite move to user');
});

//Delete Favorite Movies from users
app.delete('/users/:id/movies/:title', (req, res) => {
    res.status(201).send('Successfully removed favorite move from user');
});


// listen for requests
app.listen(8080, () => {
    console.log('Your app  is listening on port 8080.');
});
