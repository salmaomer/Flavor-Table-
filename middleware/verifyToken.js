require("dotenv").config(); 
const jwt = require('jsonwebtoken');

function RouteGuard(req, res, next) {
    const authHeader = req.headers["authorization"];
    const tokenFromHeader = authHeader ? authHeader.split(" ")[1] : null;
    const tokenFromQuery = req.query.token;

    const token = tokenFromHeader || tokenFromQuery;

    console.log("Token received in middleware:", token);

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: "No token provided, Access Denied" });
    }

    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Token decoded successfully:", decode);
        req.user = decode;
        next();
    } catch (error) {
        console.log("Token verification error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
}


module.exports = RouteGuard;
