// necessary libraries
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// cookie setup

// knex database
const db = require('./knexconfigfile');

// initialize server
const server = express();

server.use(express.json());
// cookie setup
server.use(
    session({
        name: "Monkeying around",
        secret: 'this is another super super secret, secret!',
        cookie: {
            maxAge: 1000 * 60,
            secure: false, // change this to true after deployment
        },
        httpOnly: true,
        saveUninitialized: false,
        resave: false
    })
);

// all of the endpoints

    // /api/register 

server.post('/api/register', (req, res) => {
    const user = req.body;

    if (user.username && user.password && user.department){
        const hash = bcrypt.hashSync(user.password, 14);
        db('users')
            .insert({ username: user.username, password: hash, department: user.department })
            .then (response => {
                res.status(201).json({successMessage: `The user has been created, ${response} rows affected`})
            })
            .catch(err => {
                res.status(500).json({errorMesage: `There was an error with saving the user to the database ${err}`});
            });
    } else {
        res.status(400).json({errorMessage: "Please be sure to include a username, a password, and a department"});
    }
});

    // /api/login

server.post('/api/login', (req, res) => {
    const credentials = req.body;

    db('users')
        .first()
        .where('username', credentials.username)
        .then(user => {
            if (!user || !bcrypt.compareSync(credentials.password, user.password)){
                res.status(401).json({errorMessage: 'The credentials are invalid'});
            } else {
                const token = generateToken(user);
                req.session.user = user;
                res.status(200).json({
                    successMessage: "You have logged in!",
                    username: user.username,
                    token: token
                });
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: `There was an error with pulling up the user from the database ${err}`});
        });
});

    // /api/users need to have a session

server.get('/api/users', (req, res) => {
    if (req.session && req.session.user){
        db('users')
            .then(users => {
                res.status(200).json(users);
            })
            .catch(err => {
                res.status(500).json({errorMessage: `There was an error with retrieving the info from the database ${err}`})
            });
    } else {
        res.status(401).json({errorMessage: "You shall not pass"});
    }
});

function generateToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    };
    const secret = "This is my super secret, secret!";
    const options = {
        expiresIn: '1d'
    };

    return jwt.sign(payload, secret, options);
}

// start server

server.listen(5000, () => {
    console.log('server listening on port 5000');
});