const jwt = require("jsonwebtoken");
const conf = require('../config/config');

const verifyToken = (req, res, next) => {
    console.log(req.body)
    console.log("headers :: ", req.headers);
    console.log("x-access-token :: ", req.headers["x-access-token"]);
    const token = req.body || req.headers || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("Token is required!");
    }

    try {
        const decoded = jwt.verify(token, conf.JWT_USER.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

module.exports = {
    verifyToken
}