# Skyora — Server (Back-End)

The back-end of **Skyora**, a full-stack travel booking platform. A RESTful API built with **Express 5** and **PostgreSQL** (using the `pg` driver with raw SQL) that powers the catalogue (flights, hotels, bundles), user accounts, bookings, and reviews, with role-based authorization for administrative actions.

> Front-end repository: [skyora-client](https://github.com/obada-halaybeh/skyora-client)

---

## Tech Stack

| Concern    | Technology                           |
| ---------- | ------------------------------------ |
| Runtime    | Node.js                              |
| Framework  | Express 5                            |
| Database   | PostgreSQL                           |
| DB driver  | `pg` (raw parameterised SQL, no ORM) |
| Middleware | `cors`, `morgan`                     |
| Config     | `dotenv`                             |
| Dev server | `nodemon`                            |

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 14+ installed and running

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/obada-halaybeh/skyora-server.git
cd skyora-server

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root. Match the variable names to those used in `db.js`:

```env
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=skyora
PORT=5000
```

### Database Setup

Create the database, then load the schema and seed data:

```bash
# Create the database
createdb skyora

# Load the table structure
psql -d skyora -f schema.sql

# Load realistic seed data
psql -d skyora -f seed.sql
```

### Run the Server

```bash
npm run dev      # start with nodemon (auto-reload)
```

The API runs at **http://localhost:5000**.

---

## Project Structure

```
skyora-server/
├── routes/
│   ├── auth.js          # signup / login
│   ├── flights.js       # flights CRUD
│   ├── hotels.js        # hotels CRUD (+ rooms, offers, gallery)
│   ├── bundles.js       # bundles CRUD (+ timeline, breakdown)
│   ├── bookings.js      # bookings list / create
│   ├── reviews.js       # reviews list / create
│   └── users.js         # users management
├── middleware/
│   └── adminAuth.js     # role-based authorization (x-role header)
├── db.js                # PostgreSQL connection (pg.Client)
├── server.js            # app entry, mounts routes + middleware
├── schema.sql           # table definitions
├── seed.sql             # realistic sample data
├── .env                 # environment variables (not committed)
└── package.json
```

---

## Authentication & Authorization

- **Authentication** — handled by `/api/auth`. On login the server verifies the email and password against the `users` table and returns the user record, including their `role` (`customer` or `admin`).
- **Authorization** — all write operations (create, update, delete) are protected by the `adminAuth` middleware, which checks for an **`x-role: admin`** request header and rejects the request otherwise. Read endpoints are open.

> Admin requests must include the header: `x-role: admin`

---

## API Reference

Base URL: `http://localhost:5000/api`
All request and response bodies are **JSON**.
🔒 = requires `x-role: admin` header.

### Auth — `/api/auth`

| Method | Endpoint       | Body                        | Description                |
| ------ | -------------- | --------------------------- | -------------------------- |
| POST   | `/auth/signup` | `{ name, email, password }` | Register a new user        |
| POST   | `/auth/login`  | `{ email, password }`       | Log in; returns `{ user }` |

**Example — login**

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "jane@email.com", "password": "secret" }
```

```json
{
  "user": {
    "id": 1,
    "name": "Jane",
    "email": "jane@email.com",
    "role": "customer"
  }
}
```

### Flights — `/api/flights`

| Method    | Endpoint       | Description         |
| --------- | -------------- | ------------------- |
| GET       | `/flights`     | List all flights    |
| GET       | `/flights/:id` | Get a single flight |
| POST 🔒   | `/flights`     | Create a flight     |
| PUT 🔒    | `/flights/:id` | Update a flight     |
| DELETE 🔒 | `/flights/:id` | Delete a flight     |

### Hotels — `/api/hotels`

| Method    | Endpoint      | Description                                           |
| --------- | ------------- | ----------------------------------------------------- |
| GET       | `/hotels`     | List all hotels                                       |
| GET       | `/hotels/:id` | Get a hotel with its rooms, offers, gallery & reviews |
| POST 🔒   | `/hotels`     | Create a hotel                                        |
| PUT 🔒    | `/hotels/:id` | Update a hotel                                        |
| DELETE 🔒 | `/hotels/:id` | Delete a hotel                                        |

### Bundles — `/api/bundles`

| Method    | Endpoint       | Description                                      |
| --------- | -------------- | ------------------------------------------------ |
| GET       | `/bundles`     | List all bundles                                 |
| GET       | `/bundles/:id` | Get a bundle with its timeline & price breakdown |
| POST 🔒   | `/bundles`     | Create a bundle                                  |
| PUT 🔒    | `/bundles/:id` | Update a bundle                                  |
| DELETE 🔒 | `/bundles/:id` | Delete a bundle                                  |

### Bookings — `/api/bookings`

| Method | Endpoint        | Body                                                                                  | Description                    |
| ------ | --------------- | ------------------------------------------------------------------------------------- | ------------------------------ |
| GET    | `/bookings`     | —                                                                                     | List all bookings              |
| POST   | `/bookings`     | `{ ref, user_email, type, item_id, customer, trip, seat, room, booking_date, price }` | Create a booking               |
| PUT    | `/bookings/:id` | `{ status }`                                                                          | Update a booking (e.g. cancel) |

**Example — create booking**

```http
POST /api/bookings
Content-Type: application/json

{
  "ref": "SKY-8F2A",
  "user_email": "jane@email.com",
  "type": "flight",
  "item_id": 3,
  "customer": "Jane Doe",
  "trip": "London → Dubai",
  "seat": "12A",
  "booking_date": "2026-07-01",
  "price": 620
}
```

### Reviews — `/api/reviews`

| Method | Endpoint   | Body                                                 | Description     |
| ------ | ---------- | ---------------------------------------------------- | --------------- |
| GET    | `/reviews` | —                                                    | List reviews    |
| POST   | `/reviews` | `{ type, item_id, name, rating, text, review_date }` | Create a review |

### Users — `/api/users`

| Method    | Endpoint     | Description    |
| --------- | ------------ | -------------- |
| GET 🔒    | `/users`     | List all users |
| PUT 🔒    | `/users/:id` | Update a user  |
| DELETE 🔒 | `/users/:id` | Delete a user  |

### Weather (third-party integration)

| Method | Endpoint         | Description                                                      |
| ------ | ---------------- | ---------------------------------------------------------------- |
| GET    | `/weather/:city` | Proxy current weather for a city (used by the hotel detail page) |

---

## Database Schema

The database consists of **11 tables**. Catalogue tables (`flights`, `hotels`, `bundles`) have child tables for their nested data, and all parent–child relationships are enforced with foreign keys.

| Table              | Description                       | Foreign keys                       |
| ------------------ | --------------------------------- | ---------------------------------- |
| `users`            | Accounts (`role`: customer/admin) | —                                  |
| `flights`          | Flight catalogue                  | —                                  |
| `hotels`           | Hotel catalogue                   | —                                  |
| `rooms`            | Room types per hotel              | `hotel_id → hotels(id)`            |
| `hotel_offers`     | Offers per hotel                  | `hotel_id → hotels(id)`            |
| `hotel_gallery`    | Gallery seeds per hotel           | `hotel_id → hotels(id)`            |
| `bundles`          | Flight + hotel packages           | `hotel_id → hotels(id)`            |
| `bundle_timeline`  | Itinerary steps per bundle        | `bundle_id → bundles(id)`          |
| `bundle_breakdown` | Price breakdown per bundle        | `bundle_id → bundles(id)`          |
| `bookings`         | Customer bookings                 | `user_email → users(email)`        |
| `reviews`          | Item reviews                      | _polymorphic (`type` + `item_id`)_ |

> **Note on `bookings` and `reviews`:** these reference a flight, hotel, or bundle through a `(type, item_id)` pair rather than a single foreign key, because a SQL foreign key can only target one table. This **polymorphic association** is enforced in the application layer.

---

## Conventions & Best Practices

- **Raw parameterised SQL** (`$1`, `$2`, …) on every query to prevent SQL injection.
- **`RETURNING *`** on writes so the API responds with the affected row.
- **`try/catch`** in every route handler, returning appropriate HTTP status codes (`200`, `201`, `400`, `401`, `404`, `500`).
- **Separation of concerns** — one route file per resource, a dedicated middleware file, and an isolated `db` connection.
- **`morgan`** logs every request; **`cors`** allows the client origin.

---

## Deployment

1. Provision a managed PostgreSQL database (**Neon**, **Supabase**, or **Railway**) and run `schema.sql` + `seed.sql` against it.
2. Deploy the Express server to **Render** or **Railway**, setting the environment variables in the platform dashboard.
3. Update the client's API base URL and the server's `cors` origin to the deployed front-end.

**Deployed URL:** _(add your Render/Railway URL here)_

---

## License

This project was developed as part of the _Special Topics in Computer Science 1_ course at Al Hussein Technical University (HTU).
