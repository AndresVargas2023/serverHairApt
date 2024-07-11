const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET_KEY;

module.exports.authenticate = (req, res, next) => {
    console.log("Cookies:", req.cookies);
    
    jwt.verify(req.cookies.userToken, secret, (err, payload) => {
        if (err) {
            console.error("Error verifying JWT:", err);
            res.status(401).json({ verified: false });
        } else {
            console.log("JWT payload:", payload);
            next();
        }
    });
};
