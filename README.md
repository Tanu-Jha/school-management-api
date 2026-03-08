# School Management API

Node.js + Express.js + MySQL API for managing school data with proximity-based sorting.

---

## Project Structure

```
school-management-api/
├── app.js                          # Entry point
├── config/
│   └── database.js                 # MySQL pool + auto table creation
├── controllers/
│   └── schoolController.js         # Business logic (Haversine distance)
├── middleware/
│   └── validators.js               # express-validator rules
├── routes/
│   └── schoolRoutes.js             # Route definitions
├── setup.sql                       # Manual DB + seed data script
├── .env.example                    # Environment variable template
├── School_Management_API.postman_collection.json
└── package.json
```

---

## 1 — Local Setup

### Prerequisites

| Tool    | Version  |
|---------|----------|
| Node.js | ≥ 18     |
| MySQL   | ≥ 5.7    |

### Steps

```bash
# Clone / download the project
cd school-management-api

# Install dependencies
npm install

# Create & configure .env (edit with your MySQL credentials)
cp .env.example .env

# Create the database in MySQL
mysql -u root -p < setup.sql      # or run setup.sql in MySQL Workbench

# Start the server
npm start          # production
npm run dev        # development (auto-restart on changes, Node ≥ 18.11)
```

Server starts at **http://localhost:3000**.

---

## 2 — API Reference

### `GET /` — Health Check

```
GET http://localhost:3000/
```

Response `200`:
```json
{
  "success": true,
  "message": "School Management API is running.",
  "endpoints": {
    "addSchool": "POST /addSchool",
    "listSchools": "GET  /listSchools?latitude=XX&longitude=YY"
  }
}
```

---

### `POST /addSchool` — Add a School

**Headers:** `Content-Type: application/json`

**Body:**
```json
{
  "name": "Delhi Public School",
  "address": "Sector 19, Patna, Bihar",
  "latitude": 25.6120,
  "longitude": 85.1580
}
```

**Validation rules:**
- `name` — required, 2-255 chars
- `address` — required, 5-500 chars
- `latitude` — required, float between -90 and 90
- `longitude` — required, float between -180 and 180

**Success `201`:**
```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Sector 19, Patna, Bihar",
    "latitude": 25.612,
    "longitude": 85.158
  }
}
```

**Validation error `400`:**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "name", "message": "Name is required." }
  ]
}
```

---

### `GET /listSchools` — List Schools by Proximity

**Query params:** `latitude` & `longitude` (both required, same range rules)

```
GET http://localhost:3000/listSchools?latitude=25.61&longitude=85.14
```

**Success `200`:**
```json
{
  "success": true,
  "message": "Found 5 school(s), sorted by proximity.",
  "user_location": { "latitude": 25.61, "longitude": 85.14 },
  "count": 5,
  "data": [
    {
      "id": 5,
      "name": "Loyola High School",
      "address": "Kurji, Patna, Bihar",
      "latitude": 25.635,
      "longitude": 85.135,
      "distance_km": 2.81
    }
  ]
}
```

Distance is calculated using the **Haversine formula** (great-circle distance in km).

---

## 3 — Deployment Guide

### Option A — Railway (Recommended, Free Tier)

1. Push code to a GitHub repo.
2. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**.
3. Add a **MySQL** plugin from the Railway dashboard.
4. Set environment variables in Railway's **Variables** tab using the values Railway provides for the MySQL plugin:
   ```
   DB_HOST=<railway mysql host>
   DB_PORT=<railway mysql port>
   DB_USER=root
   DB_PASSWORD=<railway mysql password>
   DB_NAME=railway
   PORT=3000
   ```
5. Railway auto-detects `npm start`. Deploy finishes in ~60 seconds.
6. Your live URL: `https://your-app.up.railway.app`

### Option B — Render

1. Push to GitHub.
2. [render.com](https://render.com) → **New Web Service** → connect repo.
3. Build command: `npm install` | Start command: `node app.js`.
4. Add a MySQL database (use [PlanetScale](https://planetscale.com), [Aiven](https://aiven.io), or [TiDB Cloud](https://tidbcloud.com) free tier) and set the `DB_*` env vars.

### Option C — VPS (DigitalOcean / AWS EC2)

```bash
# On the server
sudo apt update && sudo apt install -y nodejs npm mysql-server
git clone <your-repo> && cd school-management-api
npm install
cp .env.example .env   # edit with real credentials
mysql -u root -p < setup.sql
# Use pm2 to keep it alive
npm install -g pm2
pm2 start app.js --name school-api
pm2 save && pm2 startup
```

---

## 4 — Postman Collection

Import `School_Management_API.postman_collection.json` into Postman:

1. Open Postman → **Import** → drag & drop the JSON file.
2. Set the collection variable `base_url` to your server address (default `http://localhost:3000`).
3. Five pre-built requests are included:
   - Health Check
   - Add School (valid)
   - Add School (validation error)
   - List Schools (by proximity)
   - List Schools (missing params)

Each request includes saved example responses so stakeholders can see expected output immediately.

---

## 5 — Tech Stack

| Layer        | Technology                           |
|-------------|--------------------------------------|
| Runtime     | Node.js                              |
| Framework   | Express.js                           |
| Database    | MySQL (via mysql2/promise)           |
| Validation  | express-validator                    |
| Distance    | Haversine formula (in-app, no deps)  |
| CORS        | cors middleware                       |
