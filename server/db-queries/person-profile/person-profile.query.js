
// Database
const pool = require('../../util/database/pool');

// Constants


// Sample Data
const { result } = require('~/mock/db-queries/getAllPersonInformation.query.json');


/**
 * This is the format for getting info with parameters
 * @param {integer} id = userId
 */
async function getPersonInformationById(id) {
    try {
        const query = ``;
        const result = await pool.query(query, []);
        
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

async function getAllPersonInformation() {
    try {
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = { getPersonInformationById, getAllPersonInformation };
