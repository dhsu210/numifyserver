CREATE DATABASE numifyserver;

\c numifyserver;

CREATE TABLE users (
	id SERIAL PRIMARY KEY NOT NULL,
	name varchar(100) NOT NULL,
	created timestamp DEFAULT localtimestamp NOT NULL
);

CREATE TABLE dictations (
	id SERIAL NOT NULL,
	message text NOT NULL,
	rating INT NOT NULL,
	user_id INT NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(id),
	created timestamp DEFAULT localtimestamp NOT NULL
);