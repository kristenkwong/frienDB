/* To run this file in Heroku Postgres, use the following command:
heroku pg:psql postgresql-rugged-11349 < init_db.sql */

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
  'kristen', 'hello', 'Female', '1997-02-05', 'Richmond', 'Canada', 'Vancouver', 'Canada'
);

INSERT INTO users VALUES (
  'victor', 'password', 'Male', '1997-03-29', 'Hong Kong', 'Hong Kong', 'Richmond', 'Canada'
);

INSERT INTO users VALUES (
  'anthea', 'hi', 'Female', '2000-12-20', 'Richmond', 'Canada', null, null
);

INSERT INTO post (username, post_date, city, country) VALUES (
  'anthea', '2018-03-23', null, null
);

INSERT INTO post (username, post_date, city, country) VALUES (
  'kristen', '2018-03-29', 'Richmond', 'Canada'
);
