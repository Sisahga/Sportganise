INSERT INTO account (type, email, auth0_id, address, phone, first_name, last_name, picture)
VALUES
    ('PLAYER', 'test@gmail.com', 'auth1_test', '233 test rd', '5142223333',
        'Maxx', 'Crosby', null),
    ('PLAYER', 'jane.doe@example.com', 'auth2_jane', '45 Oak St', '5145551234',
     'Jane', 'Doe', null),
    ('PLAYER', 'coach.smith@example.com', 'auth3_smith', '123 Maple Ave', '5145555678',
     'John', 'Smith', null),
    ('COACH', 'admin.alex@example.com', 'auth4_alex', '789 Pine Rd', '5145559876',
     'Alex', 'Johnson', null);