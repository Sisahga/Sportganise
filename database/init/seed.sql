

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
    ('TRAINING', 'Advanced Group', 'Intensive training camp for badminton pros', 'John Doe', 1, '2024-07-01 10:00:00', 120,  '2024-08-01 12:00:00', 'Weekly', '123 test water rd.', 'Public',false),
    ('FUNDRAISER', 'Basketball Clinic', 'Skill enhancement clinic', 'Jane Doe', 20, '2024-06-15 10:00:00', 90,  NULL, NULL, '123 Main St', 'Public',false);
INSERT INTO program (type, title, description, author, capacity, occurence_date, duration, is_recurring, expiry_date, frequency, location, visibility) VALUES
    ('TRAINING', 'Advanced Group', 'Intensive training camp for badminton pros', 'John Doe', 2, '2024-07-01 10:00:00', 120, TRUE, '2024-08-01 12:00:00', 'Weekly', '123 test water rd.', 'Public'),
    ('FUNDRAISER', 'Basketball Clinic', 'Skill enhancement clinic', 'Jane Doe', 20, '2024-06-15 10:00:00', 90, FALSE, NULL, NULL, '123 Main St', 'Public');

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

INSERT INTO program_participants (program_id, account_id, type, is_confirmed, confirm_date) VALUES
(1, 3, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(1, 4, 'Subscribed', TRUE, '2024-06-20 10:30:00'),
(1, 5, 'Waitlisted', FALSE, null),
(1, 6, 'Waitlisted', FALSE, null),
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