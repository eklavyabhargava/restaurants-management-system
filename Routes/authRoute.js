require('dotenv').config()
const express = require('express')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

module.exports = (db) => {
    // API for user registration
    router.post('/register', async (req, res) => {
        const { name, username, email, password, user_type, contact_info, role } = req.body;

        // validate user data
        if (!name || !username || !email || !password || !user_type) {
            res.status(401).json("All fields are mandatory!");
            return;
        }

        try {
            // find username in "User" table, if username exist, return appropriate response
            const userFound = await db.query(`SELECT username FROM "User" WHERE username = $1`, [username]);
            if (userFound.rowCount) {
                res.json("User with given username already exist")
                return;
            }

            // find email in "User" table, if email exist, return appropriate response
            const emailFound = await db.query(`SELECT email FROM "User" WHERE email = $1`, [email])
            if (emailFound.rowCount) {
                res.json("User with given email already exist")
                return;
            }

            const insertUserQuery = `
        INSERT INTO "User" (username, email, password, user_type)
        VALUES ($1, $2, $3, $4) RETURNING user_id;`;

            const hashedPassword = await bcryptjs.hash(password, 16);

            const { rows } = await db.query(insertUserQuery, [username, email, hashedPassword, user_type])
            const userId = rows[0].user_id;

            if (user_type === 'customer') {
                const insertQuery = `INSERT INTO "Customer" (user_id, user_name, contact_info) VALUES($1, $2, $3)`;
                await db.query(insertQuery, [userId, name, contact_info ? contact_info : null]);
                
            }

            if (user_type === 'staff') {
                const insertQuery = `INSERT INTO "Staff" (user_id, user_name, role) VALUES($1, $2, $3)`;
                await db.query(insertQuery, [userId, name, role ? role : null]);
                
            }

            res.status(201).json({ message: "User Created Successfully", userId })
        } catch (error) {
            console.error('Error creating user', error)
            return res.status(500).json("Internal Error Occurred!")
        }
    });

    // API to handle login
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;

        // validate user data
        if (!username || !password) return res.json("User credentials missing");

        try {
            const getUserQuery = `SELECT user_id, password FROM "User" WHERE username = $1;`;

            const { rows } = await db.query(getUserQuery, [username]);

            // if there is no user
            if (rows.length === 0) return res.status(404).json("Invalid Credentials");

            const user_id = rows[0].user_id;
            const user_password = rows[0].password;

            const isPswrdValid = await bcryptjs.compare(password, user_password);

            if (!isPswrdValid) return res.status(401).json("Invalid Credentials");

            const jwtToken = jwt.sign({ id: user_id }, process.env.JWT_SECRET);

            // if password match with stored password
            res.status(200).json({ message: "Login Successful", jwtToken })
        } catch (error) {
            console.log("Error while verifying user: ", error);
            return res.status(500).json({ message: "Internal Error Occurred" })
        }
    });
    
    return router;
};