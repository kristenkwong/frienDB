const {Client} = require('pg'); //newer version of Javascript to get the client

// Display list of all Tags.
exports.tag_list = async function(req, res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const tags = await client.query('SELECT * FROM tag ORDER BY tag_text ASC');
    await client.end();
    console.log(tags);
    res.render('tag_list', {title: 'Tag List', tag_list: tags.rows})
  } catch(e) {
    console.log(e);
    res.render('error', {error: e})
  }
};

exports.tagsForPost = async function (client, postID) {

  try {
    const tags = await client.query('SELECT * FROM tagged WHERE postid = ' + postID + ';');
    return tags.rows;
  } catch(e) {
    console.log(e);
    return [];
  }
}

exports.tagExists = async function (client, text) {
  try {
    const tag = await client.query('SELECT * FROM tag WHERE tag_text = $1;', [text]);
    return tag.rows.length !== 0;
  } catch(e) {
    console.log(e);
    return false;
  }
}

// Display detail page for a specific Tag.
exports.tag_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag detail page: ' + req.params.id);
};

// Display Tag create form on GET
exports.tag_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag create GET')
};

// Handle Tag create for on POST
exports.tag_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag create POST');
};

// Display Tag delete form on GET
exports.tag_delete_get = function(req,res) {
  res.send('NOT IMPLEMENTED: Tag delete GET');
};

// Handle Tag delete form on POST
exports.tag_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag delete POST');
};

// Display Tag update form on GET
exports.tag_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag update GET');
};

// Handle Tag update on POST
exports.tag_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Tag update POST');
};
