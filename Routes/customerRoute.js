require('dotenv').config()
const express = require('express')
const verifyToken = require('../Middleware/verifyToken')

module.exports = (db) => {
    const router = express.Router()

    // LOGIN required
    // API to book room
    router.post('/bookRoom', verifyToken, async (req, res) => {
        const { avail_id } = req.body;
        const { user_id, user_type } = req.user;

        if (!avail_id) return res.status(400).json({ message: "Cannot get available room" })

        if (user_type === 'staff') return res.status(400).json({ message: "You are not allowed to book room" });

        // query to find and get customer id
        const getCustomerQuery = `SELECT cust_id FROM "Customer" WHERE user_id = $1;`;
        const { cust_id } = (await db.query(getCustomerQuery, [user_id])).rows[0];

        // if user_id not found in "Customer" table
        if (cust_id.length === 0) return res.status(400).json({ message: "You are not allowed to book room." });

        try {
            // Begin transaction
            await db.query('BEGIN')

            // check if the avail_id exists and is available
            const checkAvailability = `SELECT * FROM "Room_Availability" WHERE avail_id = $1 AND isAvailable = true FOR UPDATE;`;

            const { rows } = await db.query(checkAvailability, [avail_id]);

            if (rows.length === 0) {
                await db.query('ROLLBACK');
                return res.status(404).json({ message: "Room not available" })
            }

            // Query to insert booking record in Booking table
            const insertBookingQuery = `INSERT INTO "Booking" (cust_id, avail_id) VALUES($1, $2) RETURNING booking_id;`;

            const { booking_id } = (await db.query(insertBookingQuery, [cust_id, avail_id])).rows[0];

            // update the room availability to mark it as booked
            const updateAvailabilityQuery = `UPDATE "Room_Availability" SET isAvailable = false WHERE avail_id = $1;`

            await db.query(updateAvailabilityQuery, [avail_id]);

            // Commit the transaction
            await db.query('COMMIT');

            res.status(200).json({ message: "Room Booked Successfully.", booking_id });
        } catch (error) {
            // if error occurred rollback and abort all changes
            await db.query('ROLLBACK');

            console.error("Error booking room: ", error);
            return res.status(500).json({ message: "Internal Error Occurred!" })
        }
    });


    // API to get available room based on condition
    router.get('/search-rooms', async (req, res) => {
        const { capacity, date } = req.body;

        try {
            // Search for available rooms based on date and capacity
            const searchRoom = `SELECT room_id, capacity FROM "Room" WHERE capacity >= $1 AND room_id IN (
                SELECT room_id FROM "Room_Availability" WHERE avail_date = $2 AND isAvailable = true
            );`

            const { rows } = await db.query(searchRoom, [capacity, date]);

            res.status(200).json(rows)
        } catch (error) {
            console.log('Error getting rooms:', error);
            return res.status(500).json({ message: "Internal Error Occurred" })
        }
    });

    return router;
}