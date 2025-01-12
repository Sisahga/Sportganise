

INSERT INTO organization (name, type, description) VALUES
('OniBad', 'Non-Profit', 'Non-Profit for Badminton'),
('BasketTeam', 'Private', 'Team Basket');

-- All passwords are password!123
INSERT INTO account (type, email, auth0_id, address, phone, first_name, last_name, picture) VALUES
('admin', 'admin@example.com', 'auth0|6743f6a0f0ab0e76ba3d7ceb',
 '123 Rue Tarantino', '222-222-2222', 'Gustavo', 'Fring',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/gus_fring_avatar.png'),
('coach', 'coach@example.com', 'auth0|6743f68ef0ab0e76ba3d7cea',
 '456 Boulevard Marino', '333-333-3333', 'Walter', 'White',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg'),
('general', 'subscribed@example.com', 'auth0|6743f6ab1b370b4f20d286f0',
 '789 70e Papino', '444-444-4444', 'Jesse', 'Pinkman',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/jesse_pinkman_avatar.jpg'),
('general', 'waitlist@example.com', 'auth0|6743f6b2f0ab0e76ba3d7cee',
 '79 Rue Marie', '555-555-5555', 'Saul', 'Goodman',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/saul_goodman_avatar.png'),
('general', 'general@example.com', 'auth0|6743f6b91b370b4f20d286f1',
 '780 Rue Totoz', '666-666-6666', 'Skylar', 'White',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/skylar_white_avatar.jpg');

INSERT INTO label (org_id,name) VALUES
( 1,'SundayGroup'),
( 1,'General');

INSERT INTO sport (name) VALUES
('Basketball'),
('Badminton');

INSERT INTO program (type, title, description, capacity, occurence_date, duration, is_recurring, expiry_date, frequency, location, visibility, attachment) VALUES
    ('Training', 'Advanced Group', 'Intensive training camp for badminton pros', 1, '2024-07-01', 120, TRUE, '2024-08-01', 'Weekly', '123 test water rd.', 'Public', null),
    ('Fundraiser', 'Basketball Clinic', 'Skill enhancement clinic', 20, '2024-06-15', 90, FALSE, NULL, NULL, '123 Main St', 'Public', './Lab4.pdf');


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

INSERT INTO channel (name, type, image_blob) VALUES
('Badmintinors', 'GROUP',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/apocalypticLove.png'),
('Onibaddies', 'GROUP',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/Layne+Staley+portrait.jpg'),
(null, 'SIMPLE', null),
(null, 'SIMPLE', null);


INSERT INTO channel_member (channel_id, account_id, read) VALUES
(1, 2, false),
(1, 3, false),
(1, 4, true),
(2,1, true),
(2,2, false),
(3, 1, false),
(3, 2, true),
(4, 2, false),
(4, 3, true);

INSERT INTO message (channel_id, sender_id, content, type) VALUES
(1, 2, 'Welcome to Badmintinors guys!!!', 'CHAT'),
(1,3, 'Hello everyone!', 'CHAT'),
(1,4, 'Hi!', 'CHAT'),
(2, 1, 'Hello Mr White', 'CHAT'),
(3, 2, 'Sup Gus.', 'CHAT'),
(4, 3, 'Ayo Mr. White!', 'CHAT');

UPDATE channel SET last_message_id = 3 WHERE channel_id = 1;
UPDATE channel SET last_message_id = 4 WHERE channel_id = 2;
UPDATE channel SET last_message_id = 5 WHERE channel_id = 3;
UPDATE channel SET last_message_id = 6 WHERE channel_id = 4;

INSERT INTO post (account_id, title, description) VALUES
(1, 'Fundraiser for OniBad', 'Join us for fundraiser this week!'),
(2, 'Sunday Training',
 'This week we did usual intensive training. Please Let me know if you have questions.'),(3, 'Hackathon Announcement', 'Sign up for the upcoming hackathon event, solve challenges, and win prizes.'),
(1, 'Training Class for Beginners', 'We offer beginner-friendly sessions exlusive.'),
(1, 'Charity Gala Event', 'Attend our charity gala and contribute to a noble cause this weekend.'),
(2, 'Weekly Tennis Challenge', 'Participate in our tennis challenge and win a high-five.'),
(2, 'Spring Cleanup Drive', 'Help me clean my Jersey Shore beachfront as part of the community initiative.');

INSERT INTO feedback (post_id, account_id, content) VALUES
(1, 2, 'Are cats aloud??'),
(2, 3, 'It was mediocre. ');

