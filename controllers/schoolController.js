const { pool } = require('../config/database');

/**
 * Haversine formula — calculates the great-circle distance (in km)
 * between two points on Earth given their latitude/longitude.
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometres

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// ─── POST /addSchool ─────────────────────────────────────────────
async function addSchool(req, res) {
    try {
        const { name, address, latitude, longitude } = req.body;

        const [result] = await pool.query(
            'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
            [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
        );

        return res.status(201).json({
            success: true,
            message: 'School added successfully.',
            data: {
                id: result.insertId,
                name: name.trim(),
                address: address.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            },
        });
    } catch (error) {
        console.error('addSchool error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while adding the school.',
        });
    }
}

// ─── GET /listSchools ────────────────────────────────────────────
async function listSchools(req, res) {
    try {
        const userLat = parseFloat(req.query.latitude);
        const userLon = parseFloat(req.query.longitude);

        const [schools] = await pool.query('SELECT id, name, address, latitude, longitude FROM schools');

        // Attach distance and sort by proximity (nearest first)
        const sorted = schools
            .map((school) => ({
                ...school,
                distance_km: parseFloat(
                    haversineDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
                ),
            }))
            .sort((a, b) => a.distance_km - b.distance_km);

        return res.status(200).json({
            success: true,
            message: `Found ${sorted.length} school(s), sorted by proximity.`,
            user_location: { latitude: userLat, longitude: userLon },
            count: sorted.length,
            data: sorted,
        });
    } catch (error) {
        console.error('listSchools error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while fetching schools.',
        });
    }
}

module.exports = { addSchool, listSchools };
