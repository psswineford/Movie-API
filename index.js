const { response } = require('express');
const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genre = Models.Genre;
const Director = Models.Director;

const { check, validationResult } = require('express-validator');

mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

// serve files with express static 
app.use(express.static('public'));

const cors = require('cors');
app.use(cors());


// Log all requests utlizing Morgan
app.use(morgan('common'));
//app.use(bodyParser.json());  -- deprecated use express instead.  Left in for reference 
//app.use(bodyParser.urlencoded({ extended: true })); -- deprecated use express instead.  Left in for reference 
app.use(express.json()); //Used to parse json bodies
app.use(express.urlencoded({ extended: true })); //parse URL-encoded bodies

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

//error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my Movie List!');
});
/**
 *  Return all movies
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), function (req, res) {
    Movies.find()
        .then(movies => {
            res.status(201).json(movies);
        })
        .catch(error => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

/**
 *  Return movie by titles
 * @param Title
 * @return movie
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.status(201).json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error:' + err);
        });
});



/**
 *  Return genre information
 * @param Name
 * @return genre
 */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Genre.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.status(201).json(genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error:' + err);
        });
});

/**
 *  Return director information
 * @param Name
 * @return director
 */

app.get('/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Director.findOne({ Name: req.params.Name })
        .then((director) => {
            res.status(201).json(director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error:' + err);
        });
});

/**
 *  Return all users
 * @return users
 */

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error:' + err);
        });
});

/**
 *  Return user by name
 * @param Username
 * @return user
 */

app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.status(201).json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error:' + err);
        });
});


/**
 *  Add new User
 * @param Userame
 * @param Password
 * @param Email
 * @return User
 */

app.post("/users", [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
        .then(user => {
            if (user) {
                return res.status(400).send(req.body.Username + "already exists");
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                    .then(user => {
                        res.status(201).json(user);
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send("Error: " + error);
                    });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Error: " + error);
        });
});

/**
 *  Update User
 * @param Userame
 * @param Password
 * @param Email
 * @return updatedUser
 */

app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

/**
 *  Delete User
 * @param Username
 */

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 *  Add Favorite movie
 * @param Username
 * @param MovieID
 * @return updatedUser
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

/**
 *  Delete Favorite Movie
 * @param Username
 * @param MovieID
 * @return updatedUser
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
