

INSERT INTO organization (name, type, description) VALUES
('OniBad', 'Non-Profit', 'Non-Profit for Badminton'),
('BasketTeam', 'Private', 'Team Basket');

-- All passwords are password!123
INSERT INTO account (type, email, auth0_id, address, phone, first_name, last_name) VALUES
('admin', 'admin@example.com', 'auth0|6743f6a0f0ab0e76ba3d7ceb', '123 Rue Tarantino', '222-222-2222', 'Gustavo', 'Fring'),
('coach', 'coach@example.com', 'auth0|6743f68ef0ab0e76ba3d7cea', '456 Boulevard Marino', '333-333-3333', 'Walter', 'White'),
('general', 'subscribed@example.com', 'auth0|6743f6ab1b370b4f20d286f0', '789 70e Papino', '444-444-4444', 'Jesse', 'Pinkman'),
('general', 'waitlist@example.com', 'auth0|6743f6b2f0ab0e76ba3d7cee', '79 Rue Marie', '555-555-5555', 'Saul', 'Goodman'),
('general', 'general@example.com', 'auth0|6743f6b91b370b4f20d286f1', '780 Rue Totoz', '666-666-6666', 'Skylar', 'White');

INSERT INTO label (org_id,name) VALUES
( 1,'SundayGroup'),
( 1,'General');

INSERT INTO sport (name) VALUES
('Basketball'),
('Badminton');

INSERT INTO program (type, title, description, capacity, occurence_date, duration, is_recurring, expiry_date, frequency) VALUES
    ('Training', 'Advanced Group', 'Intensive training camp for badminton pros', 1, '2024-07-01', 120, TRUE, '2024-08-01', 'Weekly'),
    ('Fundraiser', 'Basketball Clinic', 'Skill enhancement clinic', 20, '2024-06-15', 90, FALSE, NULL, NULL);


-- Subscribed Blocked General (Jesse Blocked Skylar)
INSERT INTO blocklist (account_id, blocked_id) VALUES
    (3, 5);

INSERT INTO label_account (label_id, account_id, role) VALUES
(1,3, 'Subscribed'),
(1,2,'Coach'),
(1,4,'Waitlisted');

INSERT INTO organization_sport (org_id, sport_id) VALUES
(1, 2),
(2, 1);

INSERT INTO account_organization (org_id, account_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5);

-- Skipping account-settings

INSERT INTO program_participants (program_id, account_id, type, is_confirmed, confirm_date) VALUES
(1, 3, 'Player', TRUE, '2024-06-20 10:30:00');


INSERT INTO label_program (label_id, program_id, type) VALUES
(1, 1, 'Private'),
(1, 2, 'Public');

INSERT INTO channel (name) VALUES
('Sunday Group'),
(null);


INSERT INTO channel_member (channel_id, account_id) VALUES
(1, 2),
(1, 3),
(1, 4),
(2,1),
(2,2);

INSERT INTO message (channel_id, sender_id, content) VALUES
(1, 2, 'Welcome to sunday group chat.'),
(1,3, 'Hello everyone!'),
(1,4, 'Hi!'),
(2, 1, 'Hello Mr White');

INSERT INTO post (account_id, title, description) VALUES
(1, 'Fundraiser for OniBad', 'Join us for fundraiser this week!'),
(2, 'Sunday Training', 'This week we did usual intensive training. Please Let me know if you have questions.');

INSERT INTO feedback (post_id, account_id, content) VALUES
(1, 2, 'Are cats aloud??'),
(2, 3, 'It was mediocre. ');

