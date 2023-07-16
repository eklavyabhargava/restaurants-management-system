-- Create ENUM type
CREATE TYPE usr_type AS ENUM ('customer', 'staff');

-- User table
CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type usr_type NOT NULL
);

-- Customer table
CREATE TABLE "Customer" (
    cust_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE,
    user_name VARCHAR(100) NOT NULL,
    Contact_Info VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES "User" (user_id) ON DELETE CASCADE
);

-- Staff table
CREATE TABLE "Staff" (
    staff_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE,
    user_name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES "User" (user_id) ON DELETE CASCADE
);

-- Room Table
CREATE TABLE "Room" (
    room_id INTEGER PRIMARY KEY,
    capacity INTEGER NOT NULL
)

-- Room Availability table
CREATE TABLE "Room_Availability" (
    avail_id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    avail_date DATE NOT NULL,
    isAvailable Boolean DEFAULT True,
    CONSTRAINT unique_room_date UNIQUE (room_id, avail_date),
    FOREIGN KEY (room_id) REFERENCES "Room" (room_id) ON DELETE CASCADE
);

-- Booking table
CREATE TABLE "Booking" (
    booking_id SERIAL PRIMARY KEY,
    cust_id INTEGER NOT NULL,
    avail_id INTEGER UNIQUE NOT NULL,
    FOREIGN KEY (cust_id) REFERENCES "Customer" (cust_id) ON DELETE CASCADE,
    FOREIGN KEY (avail_id) REFERENCES "Room_Availability" (avail_id) ON DELETE CASCADE
)