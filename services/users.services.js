const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleweres/auth");

async function login({ username, password }, callback) {
    const user = await User.findOne({ username });

    if (user != null) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = auth.generateAccessToken(username);
            return callback(null, { ...user.toJSON(), token });
        }
        else {
            return callback({
                message: "Invalid Username or Passowrd",
            })
        }
    } else {
        return callback({
            message: "Invalide Username or Password",
        })
    }
}

async function register(params, callback) {
    if (params.username === undefined) {
        return callback({ message: "Username Required" });
    }

    const user = new User(params);
    user.save().then((response) => {
        return callback(null, response);
    }).catch((error) => {
        return callback(error);
    });
}

module.exports = {
    login,
    register,
};