import jwt from "jsonwebtoken";

//Will need for routes that require authorization
export const verifyToken = (req, res, next) => { //This is for authorization so users can hit API endpoints that a non-user would not be able to do
    try {
        let token = req.header("Authorization");

        if (!token) return res.status(403).send("Access Denied"); //If no token exists, user is not authorized

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft(); //Take everything from the 7th character to the end of the token
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET); //Verify token with secret string
        req.user = verified;
        next(); //If token is verified, move on to the next step
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};