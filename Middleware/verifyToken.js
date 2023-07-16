require('dotenv').config();

const jwt = require('jsonwebtoken');
const connectDb = require('../db');

const db = connectDb();

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    // check if auth token is not available
    if (!authorization) {
        return res.status(401).json({ Error: "Not logged In. Please Login Again!" });
    }

    const token = authorization.replace('Bearer ', "");

    // verify token
    jwt.verify(token, JWT_SECRET, async (error, payload) => {
        if (error) {
            return res.status(500).json({ Error: "Internal error occurred!" });
        }

        try {
            // find and get user's detail
            const { rows } = await db.query(`SELECT * FROM "User" WHERE user_id = $1`, [payload.id]);
            if (rows[0].rowCount === 0) {
                return res.status(404).json({ message: "User Not Found!" })
            }

            req.user = rows[0];
            next();
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ Error: "Some error occurred!" });
        }
    });
};