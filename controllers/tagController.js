const {Client} = require('pg'); //newer version of Javascript to get the client

// Display list of all Tags.
exports.tag_list = async function(req, res) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const tags = await client.query('SELECT * FROM tag WHERE EXISTS (SELECT tag_text FROM tagged WHERE tagged.tag_text=tag.tag_text) ORDER BY tag_text ASC;');
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
exports.tag_detail = async function(req, res) {

  var result = {};
  result.tag_posts = [];

  const client = new Client ({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  client.connect();

  try {
    const sql = 'SELECT * FROM post INNER JOIN tagged ON (post.postid = tagged.postid) WHERE tagged.tag_text = $1';
    const params = [req.params.id];
    console.log(sql, params);
    const tag_posts = await client.query(sql, params);
    await client.end();
    result.tag_posts = tag_posts.rows;
  } catch (err) {
    res.render('error', {error: err});
  }

  res.render('tag_detail', {title: 'Tag: ' + req.params.id, posts: result.tag_posts});
};
