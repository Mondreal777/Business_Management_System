// Database
const pool = require('~/util/database/pool');

async function healthCheck() {
    try {
        await pool.query('SELECT * FROM payment_transaction limit 1');
        
        return { status: 1 }
    } catch (err) {
        return { status: 0 };
    }
}

module.exports = { healthCheck };