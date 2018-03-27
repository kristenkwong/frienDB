const {Client} = require('pg'); //newer version of Javascript to get the client

exports.location_list = async function (req, res) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const locations = await client.query('SELECT * FROM location ORDER BY country DESC');
    await client.end();
    res.render('location_list', {title: 'Location List', location_list: locations.rows})
  } catch(e) {
    res.render('error', {error: e})
  }
}

exports.location_get = async function (req, res) {

  var result = {};
  result.location_posts = [];

  const client = new Client ({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const sql = 'SELECT * FROM post INNER JOIN location ON (post.country=location.country AND post.city=location.city) WHERE (post.city=$1 AND post.country=$2)';
    const params = [req.params.city, req.params.country];
    console.log(sql, params);
    const locations_posts = await client.query(sql, params);
    await client.end();
    result.location_posts = locations_posts.rows;
  } catch (err) {
    res.render('error', {error: err});
  }

  console.log(result.location_posts);

  if (result.location_posts.length == 0) {
    res.render('location_detail', {title: 'Location: ' + req.params.city + ', ' + req.params.country});
  } else {
    res.render('location_detail', {title: 'Location: ' + req.params.city + ', ' + req.params.country, posts: result.location_posts});
  }

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
