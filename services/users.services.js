const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const auth = require("../middleweres/auth");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const key = "otp-secret-key";

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

async function createOtp(params, callback) {
    const otp = otpGenerator.generate(4, {
        alphabets: false,
        upperCase: false,
        specialChars: false
    });

    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${params.phone}.${otp}.${expires}`;
    const hash = crypto.createHmac("sha256", key).update(data).digest("hex");
    const fullHash = `${hash}.${expires}`;

    console.log(`Your OTP is ${otp}`);;

    //Send SMS
    return callback(null, fullHash);
}

async function verifyOTP(params, callback) {
    let [hashValue, expires] = params.hash.split(".");

    let now = Date.now();

    if(now > parseInt(expires)) return callback("OTP Expired");

    let data = `${params.phone}.${params.otp}.${expires}`;
    let newCalculatedHash = crypto
      .createHmac("sha256", key)
      .update(data)
      .digest("hex");

    // Match the hashes
    if (newCalculatedHash === hashValue) {
      return callback(null, "Success");
    }

    return callback("Invalid OTP");
}

module.exports = {
    login,
    register,
    createOtp,
    verifyOTP
};