// Libraries
const mysql = require('mysql2');

// Configs
const conf = require('~/config/config');

let promisePool = null;
let pool = null;

async function checkPool() {
    if (promisePool) {
        return
    }

    try {
        pool = mysql.createPool({
            host: conf.db.host,
            user: conf.db.user,
            password: conf.db.password,
            database: conf.db.database,
            port: conf.db.port,
            connectionLimit: 10,
            waitForConnections: true,
            queueLimit: 0,
            multipleStatements: true
        });

        promisePool = pool.promise();
    } catch (error) {
        return console.log(`Could not connect - ${error}`);
    }
}

const connection = () => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, conn) => {
			if (err) {
				reject(err);
			}

			console.log('MySQL pool connected: threadId ' + conn.threadId);

			const executeQuery = (sql, binding) => {
				return new Promise((res, rej) => {
					conn.query(sql, binding, (queryErr, result) => {
						if (queryErr) {
							rej(queryErr);
						}

						res(result);
					});
				});
			};

			const release = () => {
				return new Promise((res, rej) => {
					if (err) {
						rej(err);
					}

					console.log('MySQL pool released: threadId ' + conn.threadId);

					res(conn.release());
				});
			};

			resolve({ executeQuery, release });
		});
	});
}

const query = async (sqlQuery, sqlQueryParams = []) => {
    await checkPool()

	const [ rows ] = await promisePool.query(sqlQuery, sqlQueryParams);
	
    return rows;
};

module.exports = { query, connection } ;