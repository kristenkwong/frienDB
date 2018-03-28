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
      var sql_substring = '(';
      for (var i = 0; i < req.body.column.length; i++) {
        sql_substring = sql_substring + req.body.column[i];
        if (i != req.body.column.length - 1) {
          sql_substring += ', ';
        }
        console.log(sql_substring);
      }
      sql_substring += ')';
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
  res.render('selection', {sql: sql, users: result.users_result});

  // TODO implement selection to select certain rows

}

exports.join_get = function (req, res) {
  res.render('join');
}

exports.join_post = function (req, res) {
  res.send('NOT IMPLEMENTED: JOIN POST');
}

exports.division_get = function (req, res) {
  res.send('NOT IMPLEMENTED: DIVISION GET');
}

exports.division_post = function (req, res) {
  res.send('NOT IMPLEMENTED: DIVISION POST');
}

exports.aggregation_get = function (req, res) {
  res.render('aggregation');
}

exports.aggregation_post = function (req, res) {
  res.send('NOT IMPLEMENTED: AGGREGATION POST');
}

exports.nested_aggregation_get = function (req, res) {
  res.send('NOT IMPLEMENTED: NESTED AGGREGATION GET');
}

exports.nested_aggregation_post = function (req, res) {
  res.send('NOT IMPLEMENTED: NESTED AGGREGATION POST');
}

exports.delete_get = function (req, res) {
  res.render('delete');
}

exports.delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: DELETE POST');
}

exports.update_get = function (req, res) {
  res.render('update');
}

exports.update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: UPDATE POST');
}
