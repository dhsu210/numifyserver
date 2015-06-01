CREATE DATABASE numifyserver;

\c numifyserver;

CREATE TABLE users (
  id SERIAL NOT NULL,
  name varchar(100) NOT NULL,
  dictation text NOT NULL,
  rating INT NOT NULL,
  created timestamp DEFAULT localtimestamp NOT NULL
);