\c sportganise;

GRANT ALL PRIVILEGES ON DATABASE sportganise TO sportganise;

CREATE TABLE organization(
	org_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	type VARCHAR(20) ,
	description VARCHAR(100)
);

CREATE TABLE account (
	account_id SERIAL PRIMARY KEY,
	type VARCHAR(30) NOT NULL,
	email VARCHAR(254) UNIQUE NOT NULL,
	auth0_id VARCHAR(255) UNIQUE NOT NULL,
	address VARCHAR(100),
	phone VARCHAR(20) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	picture VARCHAR(255)
);

CREATE TABLE blocklist(
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	blocked_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	PRIMARY KEY (account_id, blocked_id)
);

CREATE TABLE label (
	label_id SERIAL PRIMARY KEY,
	org_id INTEGER NOT NULL REFERENCES organization(org_id) ON DELETE CASCADE,
	name VARCHAR(50) NOT NULL
);

CREATE TABLE sport (
	sport_id SERIAL PRIMARY KEY,
	name VARCHAR(20) NOT NULL
);

CREATE TABLE label_account(
	label_id INTEGER NOT NULL REFERENCES label(label_id) ON DELETE CASCADE,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	role VARCHAR(50),
	PRIMARY KEY (account_id, label_id)
);

CREATE TABLE organization_sport (
	org_id INTEGER NOT NULL REFERENCES organization(org_id) ON DELETE CASCADE,
	sport_id INTEGER NOT NULL REFERENCES sport(sport_id) ON DELETE CASCADE,
	PRIMARY KEY (org_id,sport_id)
);

CREATE TABLE account_organization (
	org_id INTEGER NOT NULL REFERENCES organization(org_id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, account_id)
);

--need to populate with settings items
CREATE TABLE account_settings (
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	PRIMARY KEY(account_id)
);

CREATE TABLE program (
	program_id SERIAL PRIMARY KEY,
	type VARCHAR(20),
	title VARCHAR(30) NOT NULL,
	description VARCHAR (100),
	capacity INTEGER,
	occurence_date DATE,
	duration INTEGER,
	is_recurring BOOLEAN DEFAULT FALSE,
	expiry_date DATE,
	frequency VARCHAR(10)
	CONSTRAINT check_recurrence
		CHECK( (is_recurring = TRUE AND expiry_date IS NOT NULL AND frequency IS NOT NULL)
		OR (is_recurring = FALSE AND expiry_date IS NULL AND frequency IS NULL)
    )
);

CREATE TABLE program_participants (
	program_id INTEGER NOT NULL REFERENCES program(program_id) ON DELETE CASCADE,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	type VARCHAR(20),
	is_confirmed BOOLEAN DEFAULT FALSE,
	confirm_date TIMESTAMP,
	PRIMARY KEY (program_id, account_id),
	CONSTRAINT check_confirmation
CHECK (( is_confirmed = TRUE AND confirm_date IS NOT NULL) OR (is_confirmed = FALSE AND confirm_date IS NULL))
);

CREATE TABLE label_program (
	label_id INTEGER NOT NULL REFERENCES label(label_id),
	program_id INTEGER NOT NULL REFERENCES program(program_id),
	type VARCHAR(20),
	PRIMARY KEY (label_id, program_id)
);

CREATE TABLE channel (
	channel_id SERIAL PRIMARY KEY,
	name VARCHAR(50),
    type VARCHAR(10) NOT NULL,
    image_blob VARCHAR(512),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE Table channel_member (
	channel_id INTEGER NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE SET NULL,
    read BOOLEAN NOT NULL,
	PRIMARY KEY(channel_id, account_id)
);

CREATE TABLE message (
	message_id SERIAL PRIMARY KEY,
	channel_id INTEGER NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
	sender_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE SET NULL,
	content VARCHAR(512) NOT NULL,
	sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE channel
ADD last_message_id INTEGER REFERENCES message(message_id);

CREATE TABLE post(
	post_id SERIAL PRIMARY KEY,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	title VARCHAR(100) NOT NULL,
	description TEXT NOT NULL,
	attachment VARCHAR(255),
	creation_date DATE DEFAULT CURRENT_DATE NOT NULL
);

CREATE TABLE feedback(
	post_id INTEGER NOT NULL REFERENCES post(post_id) ON DELETE CASCADE,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	content TEXT NOT NULL,
	creation_date DATE DEFAULT CURRENT_DATE NOT NULL,
	PRIMARY KEY (post_id,account_id)
);
