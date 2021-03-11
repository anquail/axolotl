const { Pool } = require("pg");

// URI to update to
const PG_URI =
  "postgres://rgsjjown:2WhdQAnsXlhbYoGjOR9gLzXZKbsRRJut@ziggy.db.elephantsql.com:5432/rgsjjown";

// // Original from scratch project
// const PG_URI = 'postgres://hiymgopt:wKpwrNMmy5aoJVzb1C9cncdWdkTExgNH@ziggy.db.elephantsql.com:5432/hiymgopt';

// creates a new pool using the connection URI
const pool = new Pool({
  connectionString: PG_URI,
  max: 5,
  min: 0,
  idle: 10000,
});

// exports an object with a method on it that makes queries to database
module.exports = {
  query: (text, params, callback) => {
    console.log("Querying for: ", text);
    return pool.query(text, params, callback);
  },
};
