require('dotenv').config()
const express = require('express')
const verifyToken = require('../Middleware/verifyToken')

const router = express.Router()

module.exports = (db) => {
    // LOGIN required
    // API to update room availability
    router.post('/updateRoom', verifyToken, async (req, res) => {
        const { room_id, isAvailable, avail_date } = req.body;

        // validate input
        if (!room_id || !isAvailable || !avail_date) return res.status(400).json({ message: "Required fields are missing" })

        const { user_type } = req.user;

        // check if user is staff or not
        if (user_type != 'staff') return res.status(401).json({ message: "You are not allowed to make change." })

        try {
            // Insert or Update room availability in database
            const updateQuery = `INSERT INTO "Room_Availability" (room_id, avail_date, isAvailable)
            VALUES($1, $2, $3)
            ON CONFLICT (room_id, avail_date) DO UPDATE SET isAvailable = $3;`;

            await db.query(updateQuery, [room_id, avail_date, isAvailable]);

            res.status(200).json({ message: "Room availability updated" })
        } catch (error) {
            console.error("Error adding new room availability: ", error);
            return res.status(500).json({ message: "Internal Error Occurred" })
        }
    });

    return router;
}