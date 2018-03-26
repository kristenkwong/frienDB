const {Client} = require('pg'); //newer version of Javascript to get the client

exports.location_list = async function (req, res) {
  res.send('NOT IMPLEMENTED YET, LOCATION LIST')
}

// Return true if the location tuple already exists in the location table
// Else create new tuple
exports.checkIfLocationExists = async function (res, city, country) {

  var result = {};
  result.location_get = [];
  result.location_set = [];

  console.log("location: ", city, country);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  })

  client.connect();

  try {
    const sql = "SELECT * FROM location WHERE city = $1 and country = $2;";
    params = [city, country];
    console.log(sql, params);
    result.location_get = await client.query(sql, params);

    if (result.location_get.rowCount == 0) { // location tuple was not found

      const sql = "INSERT INTO location (city, country) VALUES ($1, $2);";
      params = [city, country];
      console.log("Inserting tuple: ", sql, params);
      result.location_set = await client.query(sql, params);
      console.log("Inserted tuple: ", result.location_set.rows)
    }

    await client.end();
  } catch (e) {
    res.render('error', {error: e});
  }

  console.log("Result of location query", result.location_get);
  console.log("Number of tuples found: ", result.location_get.rowCount);
  console.log((result.location_get.rowCount ==0));

  return result;
}
