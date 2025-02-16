

INSERT INTO organization (name, type, description) VALUES
('OniBad', 'Non-Profit', 'Non-Profit for Badminton'),
('BasketTeam', 'Private', 'Team Basket');

-- All passwords are password!123
INSERT INTO account (
    type, email, auth0_id,
    address_line, address_city, address_province, address_country, address_postal_code,
    phone, first_name, last_name,
    picture,verified) VALUES
('ADMIN', 'admin@example.com', 'auth0|6743f6a0f0ab0e76ba3d7ceb',
 '123 Rue Tarantino', 'Montreal', 'Quebec', 'Canada', 'H1H 2H3',
 '222-222-2222', 'Gustavo', 'Fring',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/gus_fring_avatar.png',true),
('COACH', 'coach@example.com', 'auth0|6743f68ef0ab0e76ba3d7cea',
 '456 Boulevard Marino', 'Laval', 'Quebec', 'Canada', 'H1I 1J1',
 '333-333-3333', 'Walter', 'White',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg',true),
('PLAYER', 'subscribed@example.com', 'auth0|6743f6ab1b370b4f20d286f0',
 '789 70e Papino', 'New York', 'New York', 'United States', '90210-1234',
 '444-444-4444', 'Jesse', 'Pinkman',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/jesse_pinkman_avatar.jpg',true),
('PLAYER', 'waitlist@example.com', 'auth0|6743f6b2f0ab0e76ba3d7cee',
 '79 Rue Marie', 'Paris', 'France', 'France', '123-12345',
 '555-555-5555', 'Saul', 'Goodman',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/saul_goodman_avatar.png',true),
('GENERAL', 'general@example.com', 'auth0|6743f6b91b370b4f20d286f1',
 '780 Rue Totoz', 'Montréal', 'Québec', 'Canada', 'H0H 0H0',
 '666-666-6666', 'Skylar', 'White',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/skylar_white_avatar.jpg',true),
 ('GENERAL', 'mike@example.com', 'auth0|679a9f8ee7d1d0c93645fbb6
', '123 Rue Tarantino',
  'Montreal', 'Quebec', 'Canada', 'H1H 2H3',
  '222-222-2222', 'Mike', 'Ehrmantraut',
  'https://sportganise-bucket.s3.us-east-2.amazonaws.com/mike_avatar.png',true),
('GENERAL', 'notverified@example.com', 'auth0|679a9f9fe7d1d0c93645fbb7', '123 Rue Tarantino',
    'Montreal', 'Quebec', 'Canada', 'H1H 2H3',
    '222-222-2222', 'Jane', 'Pinkman',
    'https://sportganise-bucket.s3.us-east-2.amazonaws.com/mike_avatar.png',false);

INSERT INTO label (org_id,name) VALUES
( 1,'SundayGroup'),
( 1,'General');

INSERT INTO sport (name) VALUES
('Basketball'),
('Badminton');

INSERT INTO program (type, title, description, author, capacity, occurence_date, duration, is_recurring, expiry_date, frequency, location, visibility) VALUES
    ('TRAINING', 'Advanced Group', 'Intensive training camp for badminton pros', 'John Doe', 1, '2024-07-01 10:00:00', 120, TRUE, '2024-08-01 12:00:00', 'Weekly', '123 test water rd.', 'Public'),
    ('FUNDRAISER', 'Basketball Clinic', 'Skill enhancement clinic', 'Jane Doe', 20, '2024-06-15 10:00:00', 90, FALSE, NULL, NULL, '123 Main St', 'Public');


INSERT INTO blocklist (account_id, blocked_id) VALUES
    (2, 6);

INSERT INTO label_account (label_id, account_id, role) VALUES
(1,3, 'Subscribed'),
(1,2,'Coach'),
(1,4,'Waitlisted'),
(1,5,'Waitlisted'),
(2,1,null),
(2,2,null),
(2,3,null),
(2,4,null),
(2,5,null);

INSERT INTO organization_sport (org_id, sport_id) VALUES
(1, 2),
(2, 1);

INSERT INTO account_organization (org_id, account_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6);

-- Skipping account-settings

INSERT INTO program_attachments (program_id, attachment_url) VALUES
(1, 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/apocalypticLove.png');

INSERT INTO program_participants (program_id, account_id, type, is_confirmed, confirm_date) VALUES
(1, 3, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(1, 4, 'Subscribed', FALSE, null),
(1, 5, 'Waitlisted', FALSE, null),
(1,2, 'Coach', FALSE, null);


INSERT INTO label_program (label_id, program_id, type) VALUES
(1, 1, 'Private'),
(1, 2, 'Public');

INSERT INTO channel (name, type, image_blob, channel_hash) VALUES
('Badmintinors', 'GROUP',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/apocalypticLove.png',
 'd3404059a01f4426ac8962d8a2d07f4b82824293477b5c929e4303678cbf0359'),
('Onibaddies', 'GROUP',
 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/Layne+Staley+portrait.jpg',
 'df8fbe4237c3e1f9363d6f103185c57a782ddd8b899d6484930cebbdb6f9ca7f'),
(null, 'SIMPLE', null,
 '3a316d6d3226f84c1e46e4447fa8d5fd800bff4a1bc6498152523cd4a602b69b'),
(null, 'SIMPLE', null,
 '5bf775530e2e5fcd9c6ae577c52cd57a20d13ebb5f7bc3e8a8a7920d3a7ce41e');


INSERT INTO channel_member (channel_id, account_id, read, role) VALUES
(1, 2, false, 'ADMIN'),
(1, 3, false, 'REGULAR'),
(1, 4, true, 'ADMIN'),
(1, 1, false, 'ADMIN'),
(2,1, true, 'ADMIN'),
(2,2, false, 'REGULAR'),
(2, 4, true, 'REGULAR'),
(3, 1, false, null),
(3, 2, true, null),
(4, 2, false, null),
(4, 3, true, null);

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

INSERT INTO post (account_id, title, description, occurrence_date,type) VALUES
(1, 'Fundraiser for OniBad', 'Join us for fundraiser this week!','2025-01-20 10:30:00','FUNDRAISER'),
(1, 'Charity Gala Event', 'Attend our charity gala and contribute to a noble cause this weekend.','2025-01-20 10:30:00','FUNDRAISER'),
(2, 'Spring Cleanup Drive', 'Help me clean my Jersey Shore beachfront as part of the community initiative.','2025-01-19 10:30:00','FUNDRAISER');

INSERT INTO post (account_id, title, description,occurrence_date, type, metadata) VALUES
(1, 'Training Class for Beginners', 'We offer beginner-friendly sessions exclusive.','2025-01-21 10:30:00','TRAINING','{"programID":1}'),
(2, 'Weekly Tennis Challenge', 'Participate in our tennis challenge and win a high-five.','2025-01-01 10:30:00','TRAINING','{"programID":1}'),
(2, 'Sunday Training','This week we did usual intensive training. Please Let me know if you have questions.','2025-01-23 10:30:00','TRAINING','{"programID":1}');

INSERT INTO post_label(post_id, label_id) VALUES
(1, 2),
(2, 2),
(3, 2),
(4, 1),
(4, 2),
(5, 1),
(5, 2),
(6, 1),
(6, 2);

INSERT INTO likes(post_id, account_id) VALUES
(1, 3),
(1, 2),
(2, 3),
(3, 3),
(4, 3),
(5, 3),
(6, 3);


INSERT INTO feedback (post_id, account_id, content) VALUES
(1, 2, 'Are cats allowed??'),
(2, 3, 'It was mediocre. ');

INSERT INTO training_plan (account_id, doc_url) VALUES
(1, 'training1.doc'),
(2, 'training2.doc');

