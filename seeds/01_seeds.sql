INSERT INTO users (name, email, password) 
VALUES
  ('user1', 'user1@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('user2', 'user2@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('user3', 'user3@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('user4', 'user4@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('user5', 'user5@email.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (
  title, description, thumbnail_photo_url, cover_photo_url, 
  cost_per_night , parking_spaces, number_of_bathrooms, 
  number_of_bedrooms, country, street, city, province,
  post_code 
 )
 VALUES
  ('house1', 'description', 'thumbnail URL', 'cover photo URL',
    30, 1, 2, 3, 'Canada', 'Franklin St' , 'Vancouver', 'BC', 'V5X 1X1'),

  ('house2', 'description', 'thumbnail URL', 'cover photo URL',
    80, 3, 2, 4, 'Canada', 'Frank St' , 'Vancouver', 'BC', 'V5X 1X2'),
  
  ('house3', 'description', 'thumbnail URL', 'cover photo URL',
    15, 1, 1, 1, 'Canada', 'Fran St' , 'Vancouver', 'BC', 'V5D 1X1');


INSERT INTO reservations ( 
  start_date, end_date, property_id, guest_id
)
VALUES
  ('2018-09-11', '2018-09-15', 1, 4),
  ('2019-09-11', '2019-03-15', 2, 1),
  ('2018-01-11', '2018-04-15', 3, 2);

INSERT INTO property_reviews (guest_id, property_id, 
  reservation_id, rating, message
)
VALUES
  (2, 3, 3, 4, 'message'),
  (1, 2, 1, 3, 'message'),
  (4, 1, 2, 2, 'message');