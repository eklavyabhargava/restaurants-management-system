
# Resturant Booking System

Backend code for resturant booking application.


## Documentation

Request should be in JSON format with Bearer token in header of request.

Response will be in JSON format.


## Tech Stack

**Server:** Node, Express

**Database**
PostgreSQL


## Installation

To install Node.js

https://nodejs.org/en/download

To install PostgreSQL

https://www.postgresql.org/download/
  
    
## API Reference

#### User Registration

```http
  POST /auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Name of the user. |
| `username` | `string` | **Required**. Unique username for each user. |
| `email` | `string` | **Required**. Unique email for each user. |
| `password` | `string` | **Required**. Password for user authentication. |
| `user_type` | `string` | **Required**. Type of user. "customer" or "staff" |
| `contact_info` | `string` | **Optional**. Contact Information of user. |
| `role` | `string` | **Optional**. Role of user if Staff. |

#### User Authentication

```http
  POST /auth/login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `username`      | `string` | **Required**. username of user. |
| `password`      | `string` | **Required**. User password. |

#### API to manage room availability

```http
  POST /staff/updateRoom
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `room_id`      | `Number` | **Required**. Room ID of "Room" table. |
| `isAvailable`      | `Boolean` | **Optional**. **Default True**. Boolean value for availability. |
| `avail_date`      | `Date` | **Required**. Date on which room is available. |

#### API to search and book room

```http
  POST /customer/search-rooms
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `capacity`      | `Number` | **Optional**. Minimum required capacity. |
| `date`      | `Date` | **Optional**. Date on which room is required. |

```http
  POST /customer/bookRoom
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `avail_id`      | `Number` | **Required**. avail_id of 'Room_Availability' table. |

## Run Locally

#### Clone the project

```bash
  git clone https://github.com/eklavyabhargava/resturant-management-system.git
```

#### Go to the project directory

```bash
  cd resturant-management-system
```

#### Install dependencies

Using npm
```bash
  npm install
```

Using yarn
```bash
  yarn install
```

#### Database schema design and table creation

Run query in database shell to create database:
```bash
  CREATE DATABASE <database_name>
```

Run Script file in cmd:
```bash
  psql -U your_username -h your_host -d your_database script.sql
```

Insert sample data, run command:
```bash
  psql -U your_username -h your_host -d your_database sample_data.sql
```

#### Create .env file

| Key | Value     |
| :-------- | :------- | 
| `DB_USER`      | <your_username> |
| `DB_HOST`      | <db_hosted_on> |
| `DB_NAME`      | <db_name> |
| `DB_PASSWORD`      | <yourdb_password> |
| `DB_PORT`      | <yourdb_port> |
| `PORT`      | Port on which server run |


#### Start the server

Using node
```bash
  node server
```

Using nodemon
```bash
  nodemon server
```