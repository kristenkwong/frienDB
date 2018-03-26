/* To run this file in Heroku Postgres, use the following command:
heroku pg:psql postgresql-rugged-11349 < init_db.sql

This script drops all tables and creates new ones with sample values*/

DROP TABLE friends_with;
DROP TABLE text_post;
DROP TABLE image_post;
DROP TABLE likes;
DROP TABLE tagged;
DROP TABLE tag;
DROP TABLE post;
DROP TABLE users;
DROP TABLE location; -- dropped after the tables that depend on it

CREATE TABLE location (
  city VARCHAR (30),
  country VARCHAR (30),
  PRIMARY KEY (city, country)
);

CREATE TABLE users (
  username VARCHAR(20) NOT NULL, -- decided to do this to get a URL
  password VARCHAR(25) NOT NULL,
  first_name VARCHAR (30) NOT NULL,
  last_name VARCHAR (30) NOT NULL,
  gender VARCHAR(10), -- male, female, other
  birthdate DATE,
  born_city VARCHAR(30),
  born_country VARCHAR(30),
  lives_city VARCHAR (30),
  lives_country VARCHAR(30),
  PRIMARY KEY (username),
  FOREIGN KEY (born_city, born_country) REFERENCES location (city, country) ON DELETE SET NULL,
  FOREIGN KEY (lives_city, lives_country) REFERENCES location (city, country) ON DELETE SET NULL
);

CREATE TABLE friends_with (
  username_1 VARCHAR(20) NOT NULL,
  username_2 VARCHAR(20) NOT NULL,
  PRIMARY KEY (username_1, username_2),
  FOREIGN KEY (username_1) REFERENCES users (username) ON DELETE CASCADE,
  FOREIGN KEY (username_2) REFERENCES users (username) ON DELETE CASCADE
);

CREATE TABLE post (
  postid INTEGER GENERATED ALWAYS AS IDENTITY (
    START WITH 1
    INCREMENT BY 1),
  username VARCHAR(20) NOT NULL,
  post_date DATE NOT NULL,
  text VARCHAR(240),
  image_link VARCHAR(500),
  city VARCHAR(30),
  country VARCHAR(30),
  PRIMARY KEY (postid),
  FOREIGN KEY (city, country) REFERENCES location (city, country) ON DELETE SET NULL
);

CREATE TABLE likes (
  username VARCHAR(20) NOT NULL,
  postid INTEGER NOT NULL,
  PRIMARY KEY (username, postid),
  FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE,
  FOREIGN KEY (postid) REFERENCES post (postid) ON DELETE CASCADE
);

CREATE TABLE tag (
  tag_text VARCHAR(20) NOT NULL,
  PRIMARY KEY (tag_text)
);

CREATE TABLE tagged (
  tag_text VARCHAR(20) NOT NULL,
  postid INTEGER NOT NULL,
  PRIMARY KEY (tag_text, postid),
  FOREIGN KEY (tag_text) REFERENCES tag (tag_text) ON DELETE CASCADE,
  FOREIGN KEY (postid) REFERENCES post (postid) ON DELETE CASCADE
);

CREATE TABLE text_post ( --ISA relationship with post
  postid INTEGER NOT NULL,
  content VARCHAR(240) NOT NULL,
  PRIMARY KEY (postid),
  FOREIGN KEY (postid) REFERENCES post (postid) ON DELETE CASCADE
);

CREATE TABLE image_post (
  postid INTEGER NOT NULL,
  link VARCHAR(120) NOT NULL, -- contains link to image
  PRIMARY KEY (postid),
  FOREIGN KEY (postid) REFERENCES post (postid) ON DELETE CASCADE
);

/* INSERTING DATA INTO TABLES */

INSERT INTO location VALUES (
  'Richmond', 'Canada'
);

INSERT INTO location VALUES (
  'Vancouver', 'Canada'
);

INSERT INTO location VALUES (
  'Tokyo', 'Japan'
);

INSERT INTO location VALUES (
  'Hong Kong', 'Hong Kong'
);

INSERT INTO users VALUES (
  'kristen', 'hello', 'Kristen', 'Kwong', 'Female', '1997-02-05', 'Richmond', 'Canada', 'Vancouver', 'Canada'
);

INSERT INTO users VALUES (
  'victor', 'password', 'Victor', 'Tang', 'Male', '1997-03-29', 'Hong Kong', 'Hong Kong', 'Richmond', 'Canada'
);

INSERT INTO users VALUES (
  'anthea', 'hi', 'Anthea', 'Kwong', 'Female', '2000-12-20', 'Richmond', 'Canada', null, null
);

INSERT INTO post (username, post_date, image_link, text, city, country) VALUES (
  'anthea', '2018-03-23', null, 'Hello world! This is a post', null, null
);

INSERT INTO post (username, post_date, image_link, text, city, country) VALUES (
  'kristen', '2018-03-22', 'http://www.top13.net/wp-content/uploads/2015/10/perfectly-timed-funny-cat-pictures-5.jpg', null, 'Richmond', 'Canada'
);

INSERT INTO post (username, post_date, image_link, text, city, country) VALUES (
  'victor', '2018-03-24', 'https://www.theflyer.com/uploads/image/202141401_202141500/corgi-puppies-for-sale-pembroke-welsh-corgi-202141424_2dbcfcd646e07935_858X617.jpg', 'this is expected to work now', null, null
);

/* TODO INSERT MORE TUPLES */
