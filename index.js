const express = require('express');
const mongoose = require('mongoose');
require("dotenv").config();

const auth = require('./middleweres/auth');
const erros = require('./middleweres/erros');

//const unless = require('express-unless');
const { unless } = require("express-unless")

const app = express();

/* app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
}); */

//Credentials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
const cluster = process.env.CLUSTER
const strConect = `mongodb+srv://${dbUser}:${dbPassword}@${cluster}.mongodb.net/ecommerce-app?retryWrites=true&w=majority`


mongoose.Promise = global.Promise;
mongoose.connect(strConect, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    () => {
        console.log('Database connected');
        console.log(`http://localhost:${PORT}`);
    },
    (error) => {
        console.log('Database can`t be connected: ' + error);
    }
);

auth.verifyToken.unless = unless;
//auth.authenticateToken.unless = unless;
app.use(
    //auth.authenticateToken.unless({
    auth.verifyToken.unless({
        path: [
            { url: "/users/login", methods: ["POST"] },
            { url: "/users/register", methods: ["POST"] },
            { url: "/users/otpLogin", methods: ["POST"] },
            { url: "/users/verifyOTP", methods: ["POST"] }
        ],
    })
);

app.use(express.json());

const bodyparser = require('body-parser');


// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use("/users/", require("./routes/users.routes"));

app.use(erros.errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
    console.log(`Ok.. http://localhost:${PORT}`);
});