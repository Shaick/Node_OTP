const jwt = require('jsonwebtoken');

/* function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
    //jwt.verify(token, "Snippet_SecretKEY", (err, user) => {
    jwt.verify(token, "process.env.TOKEN_SECRET", (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
} */

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access denied" });
    try {
        const verified = jwt.verify(token, 'process.env.SECRET');
        req.user = verified;
        next(); // to continue the flow
    } catch (err) {
        res.status(400).json({ error: "Token is not valid" });
    }
};

function generateAccessToken(username) {
    //return jwt.sign({ data: username }, "Snippet_Secret_KEY", {
    return jwt.sign({ data: username }, 'process.env.SECRET', {
        expiresIn: "1h",
    })
}

module.exports = {
    verifyToken,
    //authenticateToken,
    generateAccessToken,
}