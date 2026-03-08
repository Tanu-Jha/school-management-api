require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health-check route ─────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'School Management API is running.',
        endpoints: {
            addSchool: 'POST /addSchool',
            listSchools: 'GET  /listSchools?latitude=XX&longitude=YY',
        },
    });
});

// ─── API routes ─────────────────────────────────────────────────
app.use('/', schoolRoutes);

// ─── 404 handler ────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global error handler ───────────────────────────────────────
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong.' });
});

// ─── Start server ───────────────────────────────────────────────
async function start() {
    try {
        await initializeDatabase();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

start();
