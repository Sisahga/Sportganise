\c sportganise;

GRANT ALL PRIVILEGES ON DATABASE sportganise TO sportganise;

CREATE TABLE organization(
	org_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	type VARCHAR(20),
	description VARCHAR(100)
);

CREATE TABLE account (
	account_id SERIAL PRIMARY KEY,
	type VARCHAR NOT NULL CHECK (type IN ('ADMIN', 'COACH', 'PLAYER', 'GENERAL')),
	email VARCHAR(254) UNIQUE NOT NULL,
	auth0_id VARCHAR(255) UNIQUE NOT NULL,
	address_line VARCHAR(100),
	address_city VARCHAR(20),
	address_province VARCHAR(20),
	address_country VARCHAR(20),
	address_postal_code VARCHAR(15),
	phone VARCHAR(20) NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	picture VARCHAR(255),
    verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE blob (
    blob_id SERIAL PRIMARY KEY,
    blob_url VARCHAR(255) NOT NULL
);

CREATE TABLE verification (
    verification_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    code INTEGER NOT NULL,
    expiry_date_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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

CREATE TYPE program_type as ENUM('TRAINING', 'SPECIALTRAINING', 'FUNDRAISER', 'TOURNAMENT');

CREATE CAST (varchar AS program_type) WITH INOUT AS IMPLICIT; 	

CREATE TABLE program (
	program_id SERIAL PRIMARY KEY,
	type program_type,
	title VARCHAR(30) NOT NULL,
	author VARCHAR(20) NOT NULL,
	description VARCHAR(100),
	capacity INTEGER,
	occurence_date TIMESTAMPTZ,
	duration INTEGER,
	is_recurring BOOLEAN DEFAULT FALSE,
	expiry_date TIMESTAMPTZ,
	frequency VARCHAR(10),
	location VARCHAR(50),
	visibility VARCHAR(10),
    cancelled BOOLEAN DEFAULT FALSE
	CONSTRAINT check_recurrence
		CHECK( (is_recurring = TRUE AND expiry_date IS NOT NULL AND frequency IS NOT NULL)
		OR (is_recurring = FALSE AND expiry_date IS NULL AND frequency IS NULL)
    )
);

CREATE TABLE program_recurrence (
    recurrence_id SERIAL PRIMARY KEY,
    program_id INT REFERENCES program(program_id) ON DELETE CASCADE,
    occurence_date TIMESTAMPTZ NOT NULL,
    cancelled BOOLEAN DEFAULT FALSE
);

CREATE TABLE program_attachments (
	program_id INTEGER NOT NULL REFERENCES program(program_id) ON DELETE CASCADE,
	attachment_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (program_id, attachment_url)
);

CREATE TABLE program_participants (
	program_id INTEGER NOT NULL REFERENCES program(program_id) ON DELETE CASCADE,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	type VARCHAR(20),
	rank INTEGER, 
	is_confirmed BOOLEAN DEFAULT FALSE,
	confirm_date TIMESTAMPTZ,
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
	created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    channel_hash VARCHAR(64) UNIQUE NOT NULL,
    CONSTRAINT valid_channel CHECK (type IN ('SIMPLE', 'GROUP'))
);

CREATE TABLE channel_member (
	channel_id INTEGER NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE SET NULL,
    read BOOLEAN NOT NULL,
    role VARCHAR(10), -- Can be NULL, as there are no roles for SIMPLE channels
	PRIMARY KEY(channel_id, account_id),
    CONSTRAINT valid_role CHECK (role IN ('ADMIN', 'REGULAR') OR role IS NULL)
);

CREATE TABLE message (
	message_id SERIAL PRIMARY KEY,
	channel_id INTEGER NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
	sender_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE SET NULL,
	content VARCHAR(512) NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type VARCHAR(10) NOT NULL,
    CONSTRAINT valid_message CHECK (type IN ('CHAT', 'JOIN', 'LEAVE', 'BLOCK', 'UNBLOCK', 'UPDATE', 'DELETE'))
);

CREATE TABLE message_blob (
    message_id INTEGER NOT NULL REFERENCES message(message_id) ON DELETE SET NULL,
    blob_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL,
    PRIMARY KEY (message_id, blob_url),
    CONSTRAINT valid_blob CHECK (file_type IN ('IMAGE', 'VIDEO', 'FILE'))
);

ALTER TABLE channel
ADD last_message_id INTEGER REFERENCES message(message_id);

CREATE TABLE delete_channel_request (
    delete_request_id SERIAL PRIMARY KEY,
    channel_id INTEGER UNIQUE NOT NULL REFERENCES channel(channel_id) ON DELETE CASCADE,
    requester_id INTEGER NOT NULL,
    request_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (channel_id, requester_id) REFERENCES channel_member(channel_id, account_id) ON DELETE CASCADE
);

CREATE TABLE delete_channel_request_approver (
    delete_request_id INTEGER NOT NULL REFERENCES delete_channel_request(delete_request_id) ON DELETE CASCADE,
    channel_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    status VARCHAR(8) NOT NULL,
    PRIMARY KEY (delete_request_id, approver_id),
    FOREIGN KEY (channel_id, approver_id) REFERENCES channel_member(channel_id, account_id) ON DELETE CASCADE,
    CONSTRAINT valid_status CHECK (status IN ('APPROVED', 'DENIED', 'PENDING'))
);

CREATE TABLE post(
    post_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    metadata JSON ,
    type VARCHAR(20) CHECK (type IN ('TRAINING', 'FUNDRAISER', 'TOURNAMENT','SPECIAL')),
    occurrence_date TIMESTAMPTZ,
    creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE post_label(
    post_id INTEGER NOT NULL REFERENCES post(post_id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES label(label_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, label_id)
);

CREATE TABLE likes(
    post_id    INTEGER NOT NULL REFERENCES post (post_id) ON DELETE CASCADE,
    account_id INTEGER NOT NULL REFERENCES account (account_id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, account_id)
);

CREATE TABLE post_attachment(
    post_id INTEGER NOT NULL REFERENCES post(post_id) ON DELETE CASCADE,
    attachment_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (post_id, attachment_url)
);

CREATE TABLE feedback(
    feedback_id SERIAL PRIMARY KEY,
	post_id INTEGER NOT NULL REFERENCES post(post_id) ON DELETE CASCADE,
	account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
	content TEXT NOT NULL,
	creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE training_plan(
	plan_id SERIAL PRIMARY KEY,
	account_id INTEGER NOT NULL REFERENCES account (account_id) ON DELETE CASCADE,
	doc_url VARCHAR(255) NOT NULL,
	shared BOOLEAN,
	creation_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- PRIMARY KEY is a composite key: case where user has browser and app listening for notifications at the same time.
CREATE TABLE fcm_token(
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    PRIMARY KEY (token)
);

-- Notification preferences for each user.
CREATE TABLE notification_preference(
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    events BOOLEAN DEFAULT TRUE,
    messaging BOOLEAN DEFAULT TRUE,
    training_sessions BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (account_id)
);

CREATE TABLE notification(
    notification_id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES account(account_id) ON DELETE CASCADE,
    title VARCHAR(30) NOT NULL,
    body VARCHAR(100) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

SET TIME ZONE 'America/New_York';