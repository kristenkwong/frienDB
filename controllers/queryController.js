const {Client} = require('pg'); //newer version of Javascript to get the client

exports.selection_get = function (req, res) {
  // just render the selection form
  res.render('selection');
}

exports.selection_post = async function (req, res) {
  // actual do the query
  var result = {};
  result.users_result = [];
  result.posts_result = [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  // convert columns to an array
  if (!(req.body.column instanceof Array)) {
    if(typeof req.body.column === 'undefined')
    req.body.column=[];
    else
    req.body.column = new Array(req.body.column)
  }

  console.log("columns", req.body.column);

  try {

    var sql = '';
    const sql_all = 'SELECT * FROM users;';

    if (req.body.column.length == 0) {
      throw new Error('No columns to return were chosen for the query.')
    } else if (req.body.column.length == 9) {
      sql = 'SELECT * FROM users;'
      const users = await client.query(sql);
      result.users_result = users.rows;
    } else {
      // take all parameters, concatenate to a string of (<param>, <param>)
      var sql_substring = '';
      for (var i = 0; i < req.body.column.length; i++) {
        sql_substring = sql_substring + req.body.column[i];
        if (i != req.body.column.length - 1) {
          sql_substring += ', ';
        }
        console.log(sql_substring);
      }
      sql = 'SELECT ' + sql_substring + ' FROM users;';
      console.log(sql);
      const users = await client.query(sql);
      result.users_result = users.rows;
    }

    await client.end();

  } catch (err) {
    console.log(err);
    res.render('selection', {error: err});
  }

  console.log(result.users_result);
  console.log(req.body.column)
  res.render('selection', {sql: sql, params: req.body.column, users: result.users_result});

}

exports.join_get = function (req, res) {
  res.render('join');
}

exports.join_post = function (req, res) {
  res.render('join');
}

exports.division_get = function (req, res) {
  res.render('division');
}

exports.division_post_users = async function (req, res) {
  var users_result = [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  const sql = 'SELECT username FROM users WHERE NOT EXISTS (SELECT * FROM location WHERE NOT EXISTS (SELECT * FROM post WHERE post.username=users.username AND post.city=location.city AND post.country=location.country));'

  try {
    await client.connect();

    console.log(sql);

    users_result = await client.query(sql);
    await client.end();
  } catch (err) {
    res.render('error', {error: err});
  }

  console.log(users_result.rows)
  res.render('division', {users_result: users_result.rows, sql: sql})
}

exports.division_post_locations = async function (req, res) {
  var locations_result = [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  const sql = 'SELECT city, country FROM location WHERE NOT EXISTS (SELECT * FROM users WHERE NOT EXISTS (SELECT * FROM post WHERE post.username=users.username AND post.city=location.city AND post.country=location.country));'

  try {
    await client.connect();

    console.log(sql);

    locations_result = await client.query(sql);
    await client.end();
  } catch (err) {
    res.render('error', {error: err});
  }

  console.log(locations_result.rows)
  res.render('division', {locations_result: locations_result.rows, sql: sql})
}

exports.aggregation_get = function (req, res) {
  res.render('aggregation');
}

exports.aggregation_post_count = async function (req, res) {
  console.log('hi')
  var count_result = [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  const sql = "SELECT COUNT(*) FROM " + req.body.count_query + ';';

  try {
    await client.connect();

    console.log(sql)
    count_result = await client.query(sql);
    console.log(count_result.rows[0]);
    await client.end();
  } catch (err) {
    res.render('error', {error: err});
  }

  res.render('aggregation', {count_sql: sql, count_result: count_result.rows[0]})
}

exports.aggregation_post_avgminmax = async function (req, res) {

  var avgminmax_result = [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  const sql = "SELECT " + req.body.query_type + " (EXTRACT (YEAR FROM (AGE (birthdate)))) FROM users;"

  try {
    await client.connect();

    console.log(sql)
    avgminmax_result = await client.query(sql);
    console.log(avgminmax_result.rows[0]);
    await client.end();
  } catch (err) {
    res.render('error', {error: err});
  }

  res.render('aggregation', {query: req.body.query_type, avgminmax_sql: sql, avgminmax_result: avgminmax_result.rows[0]})
}

exports.nested_aggregation_get = function (req, res) {
  res.render('aggregation-groupby')
}

exports.nested_aggregation_post = async function (req, res) {
  var result_nested = [];
  var summary_result = [];

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  const sql = 'SELECT city, country, ' + req.body.nested_aggregation + ' (EXTRACT (YEAR FROM (AGE (birthdate)))) FROM users, location WHERE users.born_city=location.city AND users.born_country=location.country GROUP BY city, country;'

  try {
    console.log(sql);
    result_nested = await client.query(sql);
    summary_result = await client.query('SELECT AVG (location_data), MIN(location_data), MAX(location_data) FROM (SELECT city, country, ' + req.body.nested_aggregation + '(EXTRACT(YEAR FROM (AGE (birthdate)))) AS location_data FROM users, location WHERE users.born_city=location.city AND users.born_country=location.country GROUP BY city, country) users, location');
    console.log(result_nested);
  } catch (err) {
    res.render('error', {error: err});
  }

  res.render('aggregation-groupby', {query_nested: req.body.nested_aggregation, sql_nested: sql, result_nested: result_nested.rows, summary_result: summary_result.rows[0]});

}

exports.delete_get = function (req, res) {
  res.render('delete');
}

exports.delete_post = function (req, res) {
  res.render('delete');
}

exports.update_get = function (req, res) {
  res.render('update');
}

exports.update_post = function (req, res) {
  res.render('update');
}
