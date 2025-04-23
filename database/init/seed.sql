

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

INSERT INTO program (type, title, description, author, capacity, occurence_date, duration, expiry_date, frequency, location, visibility, cancelled) VALUES
    ('TRAINING', 'Advanced Group', 'Intensive training camp for badminton pros', 'John Doe', 2, '2024-07-01 10:00:00', 120,  '2024-08-01 12:00:00', 'Weekly', '123 test water rd.', 'Public',false),
    ('FUNDRAISER', 'Basketball Clinic', 'Skill enhancement clinic', 'Jane Doe', 20, '2024-06-15 10:00:00', 90,  NULL, NULL, '123 Main St', 'Public',false);

INSERT INTO program_recurrence(program_id,occurrence_date,cancelled) VALUES
                                                                         (1, '2024-07-08 10:00:00', true),
                                                                         (1, '2024-07-15 10:00:00', false),
                                                                         (1, '2024-07-22 10:00:00', false),
                                                                         (1, '2024-07-29 10:00:00', false);

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

INSERT INTO program_participants (recurrence_id, account_id, type, is_confirmed, confirm_date) VALUES
(1, 3, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(1, 4, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(1, 5, 'Waitlisted', FALSE, null),
(1, 6, 'Waitlisted', FALSE, null),
(1,2, 'Coach', FALSE, null),
(2, 3, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(2, 4, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(2, 5, 'Waitlisted', FALSE, null),
(2, 6, 'Waitlisted', FALSE, null),
(2,2, 'Coach', FALSE, null),
(3, 3, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(3, 4, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(3, 5, 'Waitlisted', FALSE, null),
(3, 6, 'Waitlisted', FALSE, null),
(3,2, 'Coach', FALSE, null),
(4, 3, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(4, 4, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(4, 5, 'Waitlisted', FALSE, null),
(4, 6, 'Waitlisted', FALSE, null),
(4,2, 'Coach', FALSE, null);


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

INSERT INTO message (channel_id, sender_id, content, type, sent_at) VALUES
(1, 2, 'Welcome to Badmintinors guys!!!', 'CHAT', '2025-03-20 08:29:00-07'),
(1,3, 'Hello everyone!', 'CHAT', '2025-03-20 08:30:00-07'),
(1,4, 'Hi!', 'CHAT', '2025-03-20 09:00:00-07'),
(2, 1, 'Hello Mr White', 'CHAT', '2025-03-20 10:00:00-07'),

(3, 1, 'Mr. White, thank you for agreeing to this meeting.', 'CHAT', '2025-03-20 10:00:00-07'),
(3, 2, 'Mr. Fring, I appreciate the opportunity.', 'CHAT', '2025-03-20 10:02:15-07'),
(3, 1, 'I understand you have a unique skill set that could be valuable to my operation.', 'CHAT', '2025-03-20 10:05:45-07'),
(3, 2, 'I believe my background in chemistry offers certain advantages, yes.', 'CHAT', '2025-03-20 10:07:30-07'),
(3, 1, 'Let me be direct. I need a chemist capable of producing a product of exceptional quality.', 'CHAT', '2025-03-20 10:10:10-07'),
(3, 2, 'I can produce at 99.1% purity. Nobody else comes close.', 'CHAT', '2025-03-20 10:12:45-07'),
(3, 1, 'I''ve prepared a state-of-the-art laboratory for your work.', 'CHAT', '2025-03-20 10:17:20-07'),
(3, 2, 'What kind of equipment are we talking about?', 'CHAT', '2025-03-20 10:19:45-07'),
(3, 1, 'Everything you could need. The filtration system alone cost over 3 million dollars.', 'CHAT', '2025-03-20 10:22:30-07'),
(3, 2, 'When can I see it?', 'CHAT', '2025-03-20 10:25:15-07'),
(3, 1, 'Soon. There are procedures we must follow first.', 'CHAT', '2025-03-20 10:28:45-07'),
(3, 2, 'I need to know what I''m working with.', 'CHAT', '2025-03-20 10:32:10-07'),
(3, 1, 'Let''s discuss compensation. I''m prepared to offer three million for three months of your time.', 'CHAT', '2025-03-20 10:35:30-07'),
(3, 2, 'And if I say no?', 'CHAT', '2025-03-20 10:38:20-07'),
(3, 1, 'I don''t think that would be in your best interest, Mr. White.', 'CHAT', '2025-03-20 10:41:05-07'),
(3, 2, 'Five million.', 'CHAT', '2025-03-20 10:44:30-07'),
(3, 1, 'Three million is more than fair.', 'CHAT', '2025-03-20 10:47:15-07'),
(3, 2, 'You need me more than I need you.', 'CHAT', '2025-03-20 10:50:45-07'),
(3, 1, 'I expect 200 pounds per week.', 'CHAT', '2025-03-20 11:00:00-07'),
(3, 2, 'That''s not possible with the equipment I''ve been using.', 'CHAT', '2025-03-20 11:03:20-07'),
(3, 1, 'As I said, you''ll have everything you need.', 'CHAT', '2025-03-20 11:06:45-07'),
(3, 2, 'I''ll need an assistant.', 'CHAT', '2025-03-20 11:09:30-07'),
(3, 1, 'That can be arranged, though I would prefer you work alone.', 'CHAT', '2025-03-20 11:12:10-07'),
(3, 2, 'The process requires at least two people to maintain efficiency.', 'CHAT', '2025-03-20 11:15:40-07'),
(3, 1, 'Security is my primary concern, Mr. White.', 'CHAT', '2025-03-20 11:20:15-07'),
(3, 2, 'Mine too. I have a family.', 'CHAT', '2025-03-20 11:23:50-07'),
(3, 1, 'Then we understand each other. No one can know about our arrangement.', 'CHAT', '2025-03-20 11:27:25-07'),
(3, 2, 'What about your people?', 'CHAT', '2025-03-20 11:30:10-07'),
(3, 1, 'They are professional and discreet. Your identity will be protected.', 'CHAT', '2025-03-20 11:33:35-07'),
(3, 2, 'I need assurances.', 'CHAT', '2025-03-20 11:36:50-07'),
(3, 1, 'You''ll start next Monday. A car will pick you up at 6 AM sharp.', 'CHAT', '2025-03-20 11:40:20-07'),
(3, 2, 'I teach until 3 PM.', 'CHAT', '2025-03-20 11:43:40-07'),
(3, 1, 'That''s no longer a concern. You''ll be taking a leave of absence.', 'CHAT', '2025-03-20 11:46:15-07'),
(3, 2, 'I can''t just disappear without explanation.', 'CHAT', '2025-03-20 11:49:30-07'),
(3, 1, 'A medical issue has been arranged. Lung cancer. Very convincing.', 'CHAT', '2025-03-20 11:52:05-07'),
(3, 2, 'You''ve thought of everything, haven''t you?', 'CHAT', '2025-03-20 11:55:40-07'),
(3, 1, 'What specific chemicals will you require?', 'CHAT', '2025-03-20 12:00:00-07'),
(3, 2, 'Methylamine is the main challenge. It''s highly controlled.', 'CHAT', '2025-03-20 12:03:25-07'),
(3, 1, 'I have access to a steady supply. What else?', 'CHAT', '2025-03-20 12:06:50-07'),
(3, 2, 'Phenylacetic acid, reductive amination precursors, various catalysts.', 'CHAT', '2025-03-20 12:10:15-07'),
(3, 1, 'Make a detailed list. You''ll have everything by Monday.', 'CHAT', '2025-03-20 12:13:40-07'),
(3, 2, 'I''ll need specialized glassware too. Round bottom flasks, reflux condensers.', 'CHAT', '2025-03-20 12:17:05-07'),
(3, 1, 'How do you verify the purity of your product?', 'CHAT', '2025-03-20 12:20:30-07'),
(3, 2, 'I use a gas chromatograph. But I can tell by the crystal formation.', 'CHAT', '2025-03-20 12:23:55-07'),
(3, 1, 'We have testing equipment, but your expertise will be valuable.', 'CHAT', '2025-03-20 12:27:20-07'),
(3, 2, 'The color should be a clear blue. That''s how you know it''s pure.', 'CHAT', '2025-03-20 12:30:45-07'),
(3, 1, 'My previous chemist could only achieve a yellow product.', 'CHAT', '2025-03-20 12:34:10-07'),
(3, 2, 'That''s amateur work. I''m not surprised you''re looking elsewhere.', 'CHAT', '2025-03-20 12:37:35-07'),
(3, 1, 'You don''t need to concern yourself with distribution.', 'CHAT', '2025-03-20 12:41:00-07'),
(3, 2, 'I''d like to know where my product is going.', 'CHAT', '2025-03-20 12:44:25-07'),
(3, 1, 'Your product? I believe you misunderstand our arrangement.', 'CHAT', '2025-03-20 12:47:50-07'),
(3, 2, 'I''m the chef. The recipe is mine.', 'CHAT', '2025-03-20 12:51:15-07'),
(3, 1, 'You are an employee, Mr. White. A well-paid one.', 'CHAT', '2025-03-20 12:54:40-07'),
(3, 2, 'We''ll see about that.', 'CHAT', '2025-03-20 12:58:05-07'),
(3, 1, 'I value loyalty above all else.', 'CHAT', '2025-03-20 13:05:00-07'),
(3, 2, 'So do I.', 'CHAT', '2025-03-20 13:08:25-07'),
(3, 1, 'I hope you understand the consequences of betrayal.', 'CHAT', '2025-03-20 13:11:50-07'),
(3, 2, 'Are you threatening me?', 'CHAT', '2025-03-20 13:15:15-07'),
(3, 1, 'I''m simply stating facts. This business requires complete trust.', 'CHAT', '2025-03-20 13:18:40-07'),
(3, 2, 'Trust goes both ways, Gus.', 'CHAT', '2025-03-20 13:22:05-07'),
(3, 1, 'You''ll work 12-hour shifts, four days a week.', 'CHAT', '2025-03-20 13:25:30-07'),
(3, 2, 'That''s not enough time to meet your quota.', 'CHAT', '2025-03-20 13:28:55-07'),
(3, 1, 'The lab is designed for efficiency. You''ll manage.', 'CHAT', '2025-03-20 13:32:20-07'),
(3, 2, 'I''ll need at least six days.', 'CHAT', '2025-03-20 13:35:45-07'),
(3, 1, 'Five days. Final offer.', 'CHAT', '2025-03-20 13:39:10-07'),
(3, 2, 'Fine. Five days.', 'CHAT', '2025-03-20 13:42:35-07'),
(3, 1, 'How is your health, Mr. White?', 'CHAT', '2025-03-20 13:46:00-07'),
(3, 2, 'Why do you care?', 'CHAT', '2025-03-20 13:49:25-07'),
(3, 1, 'I need to know if you can fulfill your commitment.', 'CHAT', '2025-03-20 13:52:50-07'),
(3, 2, 'I''m in remission. I''m fine.', 'CHAT', '2025-03-20 13:56:15-07'),
(3, 1, 'Good. I''ve arranged medical care if needed.', 'CHAT', '2025-03-20 13:59:40-07'),
(3, 2, 'How thoughtful of you.', 'CHAT', '2025-03-20 14:03:05-07'),
(3, 1, 'There are cameras in the lab. For security purposes.', 'CHAT', '2025-03-20 14:06:30-07'),
(3, 2, 'You''ll be watching me?', 'CHAT', '2025-03-20 14:09:55-07'),
(3, 1, 'Consider it quality control.', 'CHAT', '2025-03-20 14:13:20-07'),
(3, 2, 'I don''t work well with someone looking over my shoulder.', 'CHAT', '2025-03-20 14:16:45-07'),
(3, 1, 'You''ll adapt.', 'CHAT', '2025-03-20 14:20:10-07'),
(3, 2, 'We''ll see about that.', 'CHAT', '2025-03-20 14:23:35-07'),
(3, 1, 'Do we have an agreement, Mr. White?', 'CHAT', '2025-03-20 14:27:00-07'),
(3, 2, 'Three million for three months. Then we reassess.', 'CHAT', '2025-03-20 14:30:25-07'),
(3, 1, 'Acceptable.', 'CHAT', '2025-03-20 14:33:50-07'),
(3, 2, 'I want half up front.', 'CHAT', '2025-03-20 14:37:15-07'),
(3, 1, 'One third. After the first successful batch.', 'CHAT', '2025-03-20 14:40:40-07'),
(3, 2, 'Fine.', 'CHAT', '2025-03-20 14:44:05-07'),
(3, 1, 'My associate Mike will handle the details from here.', 'CHAT', '2025-03-20 14:47:30-07'),
(3, 2, 'I want to deal directly with you.', 'CHAT', '2025-03-20 14:50:55-07'),
(3, 1, 'That won''t always be possible. Mike speaks for me.', 'CHAT', '2025-03-20 14:54:20-07'),
(3, 2, 'Fine, but major decisions come to me directly.', 'CHAT', '2025-03-20 14:57:45-07'),
(3, 1, 'As needed. We''ll be in touch, Mr. White.', 'CHAT', '2025-03-20 15:01:10-07'),
(3, 2, 'Looking forward to it.', 'CHAT', '2025-03-20 15:04:35-07'),
(3, 1, 'One more thing. No cell phones in the lab.', 'CHAT', '2025-03-20 15:08:00-07'),
(3, 2, 'I need to be reachable by my family.', 'CHAT', '2025-03-20 15:11:25-07'),
(3, 1, 'There will be a dedicated line for emergencies.', 'CHAT', '2025-03-20 15:14:50-07'),
(3, 2, 'That''s not good enough.', 'CHAT', '2025-03-20 15:18:15-07'),
(3, 1, 'It''s non-negotiable. Security protocols must be followed.', 'CHAT', '2025-03-20 15:21:40-07'),
(3, 2, 'Fine. But my family comes first.', 'CHAT', '2025-03-20 15:25:05-07'),
(3, 1, 'I understand family obligations, Mr. White. More than you know.', 'CHAT', '2025-03-20 15:28:30-07'),
(3, 2, 'Good.', 'CHAT', '2025-03-20 15:31:55-07'),
(3, 1, 'We''ll speak again soon.', 'CHAT', '2025-03-20 15:35:20-07'),
(3, 2, 'I''ll be ready.', 'CHAT', '2025-03-20 15:38:45-07'),
(3, 1, 'See that you are.', 'CHAT', '2025-03-20 15:42:10-07'),
(3, 2, 'Don''t underestimate me, Gus.', 'CHAT', '2025-03-20 15:45:35-07'),

(4, 3, 'Ayo Mr. White!', 'CHAT', '2025-03-19 10:00:00-07');

UPDATE channel SET last_message_id = 3 WHERE channel_id = 1;
UPDATE channel SET last_message_id = 4 WHERE channel_id = 2;
UPDATE channel SET last_message_id = 106 WHERE channel_id = 3;
UPDATE channel SET last_message_id = 107 WHERE channel_id = 4;

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

INSERT INTO training_plan (account_id, doc_url, shared) VALUES
(1, 'training1.doc', true),
(1, 'training1.2.doc', false),
(2, 'training2.doc', true);

INSERT INTO notification_preference(account_id) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7);

INSERT INTO notification(account_id, title, body) VALUES
(1, 'Welcome to OniBad', 'Welcome to OniBad!'),
(2, 'Welcome to Onibad', 'Welcome to OniBad!'),
(2, 'Training Session', 'Training upcoming March 25th @ 9:00 A.M.'),
(3, 'Welcome to OniBad', 'Welcome to OniBad!'),
(4, 'Welcome to OniBad', 'Welcome to OniBad!'),
(5, 'Welcome to OniBad', 'Welcome to OniBad!'),
(6, 'Welcome to OniBad', 'Welcome to OniBad!'),
(7, 'Welcome to OniBad', 'Welcome to OniBad!');

INSERT INTO account (
    type, email, auth0_id,
    address_line, address_city, address_province, address_country, address_postal_code,
    phone, first_name, last_name,
    picture,verified) VALUES
    ('PLAYER', 'player1@example.com', 'auth0|67e0c69d8d340ce807d3e01e', 'genericStreet1', 'genericCity', 'genericState', 'genericCountry', 'genericPostal1', '111-111-1101', 'LeBron', 'James', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/lbj.jpg', true),
('PLAYER', 'player2@example.com', 'auth0|67e0c6a34ca8e395bad263a8', 'genericStreet2', 'genericCity', 'genericState', 'genericCountry', 'genericPostal2', '111-111-1102', 'Dwayne', 'Wade', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/dwade.jpg', true),
('PLAYER', 'player3@example.com', 'auth0|67e0c6a98d340ce807d3e01f', 'genericStreet3', 'genericCity', 'genericState', 'genericCountry', 'genericPostal3', '111-111-1103', 'Chris', 'Bosh', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/cbosh.jpeg', true),
('PLAYER', 'player4@example.com', 'auth0|67e0c6ae4ca8e395bad263a9', 'genericStreet4', 'genericCity', 'genericState', 'genericCountry', 'genericPostal4', '111-111-1104', 'Mario', 'Chalmers', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/mchalmers.jpeg', true),
('PLAYER', 'player5@example.com', 'auth0|67e0c6b48d340ce807d3e020', 'genericStreet5', 'genericCity', 'genericState', 'genericCountry', 'genericPostal5', '111-111-1105', 'Ray', 'Allen', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/Ray-Allen.webp', true),
('PLAYER', 'player6@example.com', 'auth0|67e0c6ba8d340ce807d3e021', 'genericStreet6', 'genericCity', 'genericState', 'genericCountry', 'genericPostal6', '111-111-1106', 'Jayson', 'Tatum', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/jtatum.avif', true),
('PLAYER', 'player7@example.com', 'auth0|67e0c6bf4ca8e395bad263ab', 'genericStreet7', 'genericCity', 'genericState', 'genericCountry', 'genericPostal7', '111-111-1107', 'Jaylen', 'Brown', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/jbrown.avif', true),
('PLAYER', 'player8@example.com', 'auth0|67e0c6c58d340ce807d3e023', 'genericStreet8', 'genericCity', 'genericState', 'genericCountry', 'genericPostal8', '111-111-1108', 'Derrick', 'White', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/dwhite.avif', true),
('PLAYER', 'player9@example.com', 'auth0|67e0c6cb4ca8e395bad263ae', 'genericStreet9', 'genericCity', 'genericState', 'genericCountry', 'genericPostal9', '111-111-1109', 'Kristaps', 'Porzingis', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/kporz.webp', true),
('PLAYER', 'player10@example.com', 'auth0|67e0c6d14ca8e395bad263af', 'genericStreet10', 'genericCity', 'genericState', 'genericCountry', 'genericPostal10', '111-111-1110', 'Al', 'Horford', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/horford.avif', true),
('PLAYER', 'player11@example.com', 'auth0|67e0c6d74ca8e395bad263b0', 'genericStreet11', 'genericCity', 'genericState', 'genericCountry', 'genericPostal11', '111-111-1111', 'Immanuel', 'Quickley', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/quickley.webp', true),
('PLAYER', 'player12@example.com', 'auth0|67e0c6dc8d340ce807d3e025', 'genericStreet12', 'genericCity', 'genericState', 'genericCountry', 'genericPostal12', '111-111-1112', 'R.J.', 'Barrett', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/rjb.webp', true),
('PLAYER', 'player13@example.com', 'auth0|67e0c6e28d340ce807d3e026', 'genericStreet13', 'genericCity', 'genericState', 'genericCountry', 'genericPostal13', '111-111-1113', 'Scottie', 'Barnes', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/sbarnes.webp', true),
('PLAYER', 'player14@example.com', 'auth0|67e0c6e74ca8e395bad263b2', 'genericStreet14', 'genericCity', 'genericState', 'genericCountry', 'genericPostal14', '111-111-1114', 'Brandon', 'Ingram', 'null', true),
('PLAYER', 'player15@example.com', 'auth0|67e0c6ed4ca8e395bad263b3', 'genericStreet15', 'genericCity', 'genericState', 'genericCountry', 'genericPostal15', '111-111-1115', 'Gradey', 'Dick', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/dick.webp', true),
('PLAYER', 'player16@example.com', 'auth0|67e0c6f38d340ce807d3e028', 'genericStreet16', 'genericCity', 'genericState', 'genericCountry', 'genericPostal16', '111-111-1116', 'Luka', 'Doncic', 'null', true),
('PLAYER', 'player17@example.com', 'auth0|67e0c6f84ca8e395bad263b4', 'genericStreet17', 'genericCity', 'genericState', 'genericCountry', 'genericPostal17', '111-111-1117', 'Austin', 'Reaves', 'null', true),
('PLAYER', 'player18@example.com', 'auth0|67e0c6fe8d340ce807d3e029', 'genericStreet18', 'genericCity', 'genericState', 'genericCountry', 'genericPostal18', '111-111-1118', 'Rui', 'Hachimura', 'null', true),
('PLAYER', 'player19@example.com', 'auth0|67e0c7038d340ce807d3e02a', 'genericStreet19', 'genericCity', 'genericState', 'genericCountry', 'genericPostal19', '111-111-1119', 'Jaxson', 'Hayes', 'null', true),
('PLAYER', 'player20@example.com', 'auth0|67e0c7098d340ce807d3e02c', 'genericStreet20', 'genericCity', 'genericState', 'genericCountry', 'genericPostal20', '111-111-1120', 'Bronny', 'James Jr.', 'null', true),
('PLAYER', 'player21@example.com', 'auth0|67e0c70f8d340ce807d3e02d', 'genericStreet21', 'genericCity', 'genericState', 'genericCountry', 'genericPostal21', '111-111-1121', 'James', 'Harden', 'null', true),
('PLAYER', 'player22@example.com', 'auth0|67e0c7148d340ce807d3e02e', 'genericStreet22', 'genericCity', 'genericState', 'genericCountry', 'genericPostal22', '111-111-1122', 'Kawhi', 'Leonard', 'null', true),
('PLAYER', 'player23@example.com', 'auth0|67e0c71a4ca8e395bad263b8', 'genericStreet23', 'genericCity', 'genericState', 'genericCountry', 'genericPostal23', '111-111-1123', 'Ivan', 'Zubac', 'null', true),
('PLAYER', 'player24@example.com', 'auth0|67e0c71f4ca8e395bad263ba', 'genericStreet24', 'genericCity', 'genericState', 'genericCountry', 'genericPostal24', '111-111-1124', 'Norman', 'Powell', 'null', true),
('PLAYER', 'player25@example.com', 'auth0|67e0c7254ca8e395bad263bb', 'genericStreet25', 'genericCity', 'genericState', 'genericCountry', 'genericPostal25', '111-111-1125', 'Ben', 'Simmons', 'null', true),
('PLAYER', 'player26@example.com', 'auth0|67e0c72b8d340ce807d3e030', 'genericStreet26', 'genericCity', 'genericState', 'genericCountry', 'genericPostal26', '111-111-1126', 'Nick', 'Suzuki', 'null', true),
('PLAYER', 'player27@example.com', 'auth0|67e0c7304ca8e395bad263bd', 'genericStreet27', 'genericCity', 'genericState', 'genericCountry', 'genericPostal27', '111-111-1127', 'Cole', 'Caufield', 'null', true),
('PLAYER', 'player28@example.com', 'auth0|67e0c7368d340ce807d3e032', 'genericStreet28', 'genericCity', 'genericState', 'genericCountry', 'genericPostal28', '111-111-1128', 'Juraj', 'Slafkovsky', 'null', true),
('PLAYER', 'player29@example.com', 'auth0|67e0c73c8d340ce807d3e033', 'genericStreet29', 'genericCity', 'genericState', 'genericCountry', 'genericPostal29', '111-111-1129', 'Mike', 'Matheson', 'null', true),
('PLAYER', 'player30@example.com', 'auth0|67e0c7424ca8e395bad263c0', 'genericStreet30', 'genericCity', 'genericState', 'genericCountry', 'genericPostal30', '111-111-1130', 'Jordan', 'Struble', 'null', true),
('PLAYER', 'player31@example.com', 'auth0|67e0c7474ca8e395bad263c1', 'genericStreet31', 'genericCity', 'genericState', 'genericCountry', 'genericPostal31', '111-111-1131', 'Samuel', 'Montembault', 'null', true),
('PLAYER', 'player32@example.com', 'auth0|67e0c74d4ca8e395bad263c2', 'genericStreet32', 'genericCity', 'genericState', 'genericCountry', 'genericPostal32', '111-111-1132', 'Kaiden', 'Guhle', 'null', true),
('PLAYER', 'player33@example.com', 'auth0|67e0c7534ca8e395bad263c4', 'genericStreet33', 'genericCity', 'genericState', 'genericCountry', 'genericPostal33', '111-111-1133', 'Lane', 'Hutson', 'null', true),
('PLAYER', 'player34@example.com', 'auth0|67e0c7584ca8e395bad263c5', 'genericStreet34', 'genericCity', 'genericState', 'genericCountry', 'genericPostal34', '111-111-1134', 'Ivan', 'Demidov', 'null', true),
('PLAYER', 'player35@example.com', 'auth0|67e0c75e4ca8e395bad263c6', 'genericStreet35', 'genericCity', 'genericState', 'genericCountry', 'genericPostal35', '111-111-1135', 'Patrik', 'Laine', 'null', true),
('PLAYER', 'player36@example.com', 'auth0|67e0c7638d340ce807d3e037', 'genericStreet36', 'genericCity', 'genericState', 'genericCountry', 'genericPostal36', '111-111-1136', 'Alex', 'Newhook', 'null', true),
('PLAYER', 'player37@example.com', 'auth0|67e0c7698d340ce807d3e038', 'genericStreet37', 'genericCity', 'genericState', 'genericCountry', 'genericPostal37', '111-111-1137', 'Jake', 'Evans', 'null', true),
('PLAYER', 'player38@example.com', 'auth0|67e0c76f4ca8e395bad263c8', 'genericStreet38', 'genericCity', 'genericState', 'genericCountry', 'genericPostal38', '111-111-1138', 'Christian', 'Dvorak', 'null', true),
('PLAYER', 'player39@example.com', 'auth0|67e0c7748d340ce807d3e03a', 'genericStreet39', 'genericCity', 'genericState', 'genericCountry', 'genericPostal39', '111-111-1139', 'Brendan', 'Gallagher', 'null', true),
('PLAYER', 'player40@example.com', 'auth0|67e0c77a8d340ce807d3e03b', 'genericStreet40', 'genericCity', 'genericState', 'genericCountry', 'genericPostal40', '111-111-1140', 'Josh', 'Anderson', 'null', true),
('PLAYER', 'player41@example.com', 'auth0|67e0c7804ca8e395bad263ca', 'genericStreet41', 'genericCity', 'genericState', 'genericCountry', 'genericPostal41', '111-111-1141', 'Arber', 'Xhekaj', 'null', true),
('PLAYER', 'player42@example.com', 'auth0|67e0c7868d340ce807d3e03d', 'genericStreet42', 'genericCity', 'genericState', 'genericCountry', 'genericPostal42', '111-111-1142', 'Emil', 'Heineman', 'null', true),
('PLAYER', 'player43@example.com', 'auth0|67e0c78b4ca8e395bad263cb', 'genericStreet43', 'genericCity', 'genericState', 'genericCountry', 'genericPostal43', '111-111-1143', 'Jakob', 'Dobbes', 'null', true),
('PLAYER', 'player44@example.com', 'auth0|67e0c7918d340ce807d3e03e', 'genericStreet44', 'genericCity', 'genericState', 'genericCountry', 'genericPostal44', '111-111-1144', 'David', 'Savard', 'null', true),
('PLAYER', 'player45@example.com', 'auth0|67e0c7968d340ce807d3e03f', 'genericStreet45', 'genericCity', 'genericState', 'genericCountry', 'genericPostal45', '111-111-1145', 'Joel', 'Armia', 'null', true),
('COACH', 'coach1@example.com', 'auth0|67e0c79c8d340ce807d3e040', 'genericStreet46', 'genericCity', 'genericState', 'genericCountry', 'genericPostal46', '111-111-1146', 'Erik', 'Spoelstra', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/spoe.webp', true),
('COACH', 'coach2@example.com', 'auth0|67e0c7a28d340ce807d3e041', 'genericStreet47', 'genericCity', 'genericState', 'genericCountry', 'genericPostal47', '111-111-1147', 'Joe', 'Mazzulla', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/mazz.webp', true),
('COACH', 'coach3@example.com', 'auth0|67e0c7a84ca8e395bad263ce', 'genericStreet48', 'genericCity', 'genericState', 'genericCountry', 'genericPostal48', '111-111-1148', 'J.J.', 'Reddick', 'null', true),
('COACH', 'coach4@example.com', 'auth0|67e0c7ae8d340ce807d3e042', 'genericStreet49', 'genericCity', 'genericState', 'genericCountry', 'genericPostal49', '111-111-1149', 'Nick', 'Nurse', 'null', true),
('COACH', 'coach5@example.com', 'auth0|67e0c7b44ca8e395bad263cf', 'genericStreet50', 'genericCity', 'genericState', 'genericCountry', 'genericPostal50', '111-111-1150', 'Martin', 'St-Louis', 'https://sportganise-bucket.s3.us-east-2.amazonaws.com/stl.webp', true);

INSERT INTO account_organization (org_id, account_id) VALUES
                                                          (1, 7),
                                                          (1, 8),
                                                          (1, 9),
                                                          (1, 10),
                                                          (1, 11),
                                                          (1, 12),
                                                          (1, 13),
                                                          (1, 14),
                                                          (1, 15),
                                                          (1, 16),
                                                          (1, 17),
                                                          (1, 18),
                                                          (1, 19),
                                                          (1, 20),
                                                          (1, 21),
                                                          (1, 22),
                                                          (1, 23),
                                                          (1, 24),
                                                          (1, 25),
                                                          (1, 26),
                                                          (1, 27),
                                                          (1, 28),
                                                          (1, 29),
                                                          (1, 30),
                                                            (1, 31),
                                                            (1, 32),
                                                            (1, 33),
                                                            (1, 34),
                                                            (1, 35),
                                                            (1, 36),
                                                            (1, 37),
                                                            (1, 38),
                                                            (1, 39),
                                                            (1, 40),
                                                            (1, 41),
                                                            (1, 42),
                                                            (1, 43),
                                                            (1, 44),
                                                            (1, 45),
                                                            (1, 46),
                                                            (1, 47),
                                                            (1, 48),
                                                            (1, 49),
                                                            (1, 50),
                                                            (1, 51),
                                                            (1, 52),
                                                            (1, 53),
                                                            (1, 54),
                                                            (1, 55),
                                                            (1, 56);