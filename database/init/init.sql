\c sportganise;

GRANT ALL PRIVILEGES ON DATABASE sportganise TO sportganise;

CREATE TABLE organization (
  o_id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  description VARCHAR(100)
);

CREATE TABLE users (
  u_id SERIAL PRIMARY KEY,
  type VARCHAR(30) NOT NULL,
  email VARCHAR(254) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(100),
  phone VARCHAR(15) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL
);