-- ============================================
-- Skyora seed data
-- Run AFTER schema.sql
-- ============================================

-- Clear existing data (safe to re-run)
TRUNCATE reviews, bundle_breakdown, bundle_timeline, hotel_gallery, hotel_offers, rooms, bookings, bundles, hotels, flights, users RESTART IDENTITY CASCADE;

-- ===== USERS =====
INSERT INTO users (name, email, password, role, status, joined) VALUES
  ('Admin User', 'admin@skyora.com', 'admin123', 'admin', 'Active', 'Jan 2024'),
  ('James Thompson', 'user@skyora.com', 'user123', 'customer', 'Active', 'Mar 2024');

-- ===== FLIGHTS =====
INSERT INTO flights (airline, flight_no, origin, destination, from_city, to_city, from_terminal, to_terminal, country, depart, arrive, duration, stops, direct, aircraft, flight_date, price, seats, schedule, status) VALUES
  ('Emirates', 'EK002', 'LHR', 'DXB', 'London Heathrow', 'Dubai International', 'Terminal 3 · LHR', 'Terminal 3 · DXB', 'UAE', '08:15', '18:35', '7h 20m', '1 stop', false, 'Boeing 777-300ER', 'May 15, 2026', 429, 180, NULL, 'Active'),
  ('British Airways', 'BA107', 'LHR', 'DXB', 'London Heathrow', 'Dubai International', 'Terminal 5 · LHR', 'Terminal 1 · DXB', 'UAE', '10:30', '20:45', '7h 15m', '1 stop', false, 'Airbus A380', 'May 15, 2026', 389, 180, NULL, 'Active'),
  ('Emirates', 'EK002', 'LHR', 'DXB', 'London Heathrow', 'Dubai International', 'Terminal 3 · LHR', 'Terminal 3 · DXB', 'UAE', '14:00', '00:20', '7h 20m', 'Non-stop', true, 'Boeing 777-300ER', 'May 15, 2026', 512, 180, NULL, 'Active'),
  ('Lufthansa', 'LH907', 'LHR', 'DXB', 'London Heathrow', 'Dubai International', 'Terminal 2 · LHR', 'Terminal 1 · DXB', 'UAE', '06:45', '19:10', '9h 25m', '1 stop in FRA', false, 'Airbus A350', 'May 15, 2026', 318, 180, NULL, 'Active'),
  ('Singapore Airlines', 'SQ305', 'LHR', 'DXB', 'London Heathrow', 'Dubai International', 'Terminal 2 · LHR', 'Terminal 3 · DXB', 'UAE', '21:55', '10:15', '7h 20m', 'Non-stop', true, 'Airbus A380', 'May 15, 2026', 580, 180, NULL, 'Active');

-- Flight reviews
INSERT INTO reviews (type, item_id, name, rating, text, review_date) VALUES
  ('flight', 1, 'Daniel R.', 5, 'Smooth flight, friendly crew, and the entertainment system was excellent. Would fly Emirates again without hesitation.', 'April 2026'),
  ('flight', 1, 'Leila H.', 4, 'Comfortable seats and good food. The layover was a bit long but overall a pleasant journey.', 'March 2026'),
  ('flight', 2, 'Mark T.', 4, 'Solid service and the A380 is very quiet. Boarding was well organised and on time.', 'April 2026'),
  ('flight', 2, 'Priya S.', 5, 'Great crew and comfortable cabin. The connecting flight was easy to catch.', 'February 2026'),
  ('flight', 3, 'Sophie L.', 5, 'Direct and on time. The non-stop option made the whole trip so much easier. Highly recommend.', 'April 2026'),
  ('flight', 3, 'Omar A.', 5, 'Excellent flight from start to finish. Comfortable, punctual, and great service throughout.', 'March 2026'),
  ('flight', 3, 'Hannah W.', 4, 'Very good experience overall. Seat was roomy and the meals were better than expected.', 'January 2026'),
  ('flight', 4, 'Thomas K.', 4, 'Good value for the price. The Frankfurt connection was tight but I made it fine. Clean aircraft.', 'March 2026'),
  ('flight', 5, 'Grace C.', 5, 'Singapore Airlines never disappoints. The overnight flight was restful and the service was world-class.', 'April 2026'),
  ('flight', 5, 'Raj P.', 5, 'Best airline I''ve flown with. Spotless cabin, attentive crew, and the food was genuinely good.', 'February 2026');
-- ===== HOTELS =====
INSERT INTO hotels (name, location, country, stars, rating, review_count, rooms_count, price, img_seed, amenities, status) VALUES
  ('Burj Al Arab Jumeirah', 'Jumeirah Beach, Dubai', 'UAE', 5, 4.9, 2840, 3, 980, 251, 'Pool,Spa,WiFi,Restaurant', 'Active'),
  ('Atlantis The Palm', 'Palm Jumeirah, Dubai', 'UAE', 5, 4.7, 5100, 2, 620, 355, 'Waterpark,Pool,Spa,WiFi', 'Active'),
  ('Address Downtown', 'Downtown Dubai', 'UAE', 5, 4.8, 1920, 2, 450, 188, 'Pool,WiFi,Gym,Bar', 'Active'),
  ('JW Marriott Marquis', 'Business Bay, Dubai', 'UAE', 5, 4.6, 3200, 2, 320, 267, 'Pool,WiFi,Gym,Spa', 'Active'),
  ('Sofitel Dubai', 'Downtown Dubai', 'UAE', 4, 4.5, 1400, 2, 240, 312, 'Pool,WiFi,Restaurant', 'Active'),
  ('Hilton Dubai Creek', 'Deira, Dubai', 'UAE', 4, 4.4, 890, 2, 180, 433, 'WiFi,Pool,Gym', 'Active');

-- Hotel rooms
INSERT INTO rooms (hotel_id, type, size, guests, price, img_seed) VALUES
  (1, 'Deluxe Sea View', '55m²', 2, 980, 390),
  (1, 'Junior Suite', '80m²', 2, 1450, 391),
  (1, 'Royal Suite', '180m²', 4, 3200, 392),
  (2, 'Ocean Deluxe', '45m²', 2, 620, 393),
  (2, 'Family Suite', '75m²', 4, 980, 394),
  (3, 'City View King', '42m²', 2, 450, 395),
  (3, 'Fountain Suite', '70m²', 3, 720, 396),
  (4, 'Deluxe Room', '40m²', 2, 320, 397),
  (4, 'Executive Suite', '65m²', 3, 540, 398),
  (5, 'Superior Room', '35m²', 2, 240, 399),
  (5, 'Luxury Suite', '60m²', 3, 420, 400),
  (6, 'Standard Room', '30m²', 2, 180, 401),
  (6, 'Deluxe Room', '45m²', 3, 280, 402);

-- Hotel offers
INSERT INTO hotel_offers (hotel_id, label) VALUES
  (1, '🏊 Private Beach'),
  (1, '🍽 Fine Dining'),
  (1, '💆 Spa'),
  (1, '🏋 Fitness Centre'),
  (1, '🅿 Valet Parking'),
  (1, '🌐 Free WiFi'),
  (1, '🍳 Breakfast'),
  (1, '🛎 24h Concierge'),
  (2, '🌊 Waterpark'),
  (2, '🏊 Pool'),
  (2, '💆 Spa'),
  (2, '🍽 Fine Dining'),
  (2, '🌐 Free WiFi'),
  (2, '🍳 Breakfast'),
  (2, '🏋 Fitness Centre'),
  (2, '🛎 Concierge'),
  (3, '🏊 Infinity Pool'),
  (3, '🍸 Rooftop Bar'),
  (3, '🏋 Fitness Centre'),
  (3, '🌐 Free WiFi'),
  (3, '🍳 Breakfast'),
  (3, '🛎 Concierge'),
  (3, '🅿 Valet Parking'),
  (3, '💆 Spa'),
  (4, '🏊 Pool'),
  (4, '💆 Spa'),
  (4, '🏋 Fitness Centre'),
  (4, '🍽 Restaurants'),
  (4, '🌐 Free WiFi'),
  (4, '🍳 Breakfast'),
  (4, '🛎 Concierge'),
  (4, '🅿 Parking'),
  (5, '🏊 Pool'),
  (5, '🍽 French Dining'),
  (5, '🌐 Free WiFi'),
  (5, '🍳 Breakfast'),
  (5, '🏋 Gym'),
  (5, '🛎 Concierge'),
  (5, '🅿 Parking'),
  (5, '💆 Spa'),
  (6, '🏊 Pool'),
  (6, '🏋 Fitness Centre'),
  (6, '🌐 Free WiFi'),
  (6, '🍳 Breakfast'),
  (6, '🍽 Restaurant'),
  (6, '🛎 Concierge'),
  (6, '🅿 Parking'),
  (6, '🚕 Airport Shuttle');

-- Hotel gallery
INSERT INTO hotel_gallery (hotel_id, seed) VALUES
  (1, 251),
  (1, 355),
  (1, 188),
  (1, 267),
  (1, 312),
  (2, 355),
  (2, 251),
  (2, 188),
  (2, 267),
  (2, 312),
  (3, 188),
  (3, 251),
  (3, 355),
  (3, 267),
  (3, 312),
  (4, 267),
  (4, 251),
  (4, 355),
  (4, 188),
  (4, 312),
  (5, 312),
  (5, 251),
  (5, 355),
  (5, 188),
  (5, 267),
  (6, 433),
  (6, 251),
  (6, 355),
  (6, 188),
  (6, 267);

-- Hotel reviews
INSERT INTO reviews (type, item_id, name, rating, text, review_date) VALUES
  ('hotel', 1, 'Sarah M.', 5, 'Absolutely breathtaking. The service was impeccable and the views from our suite were unmatched. Worth every penny.', 'March 2026'),
  ('hotel', 1, 'James T.', 5, 'The best hotel experience I''ve ever had. The private beach is stunning and the food is world-class.', 'February 2026'),
  ('hotel', 1, 'Aisha K.', 4, 'Stunning property and wonderful staff. Only minor issue was the wait at check-in, otherwise perfect.', 'January 2026'),
  ('hotel', 2, 'Michael B.', 5, 'The waterpark alone is worth the stay. Kids loved it and the rooms were spacious and clean.', 'April 2026'),
  ('hotel', 2, 'Nadia F.', 4, 'Great family hotel with tons to do. It gets busy, but the facilities are top notch.', 'March 2026'),
  ('hotel', 3, 'Elena V.', 5, 'Incredible views of the Burj Khalifa and fountains. The rooftop bar is a must. Faultless service.', 'April 2026'),
  ('hotel', 3, 'Karim D.', 5, 'Perfectly located for exploring downtown. The infinity pool is gorgeous and the staff are lovely.', 'January 2026'),
  ('hotel', 4, 'Robert N.', 5, 'Excellent business hotel. The rooms are large, the gym is well equipped, and the restaurants are superb.', 'March 2026'),
  ('hotel', 4, 'Yuki S.', 4, 'Comfortable stay with great dining options. The spa was a highlight after long meeting days.', 'February 2026'),
  ('hotel', 5, 'Claire B.', 5, 'Elegant French touch throughout. The dining was exceptional and the location is very convenient.', 'April 2026'),
  ('hotel', 5, 'Hassan M.', 4, 'Lovely hotel with attentive staff. Room was a little compact but very comfortable and well kept.', 'March 2026'),
  ('hotel', 6, 'George P.', 4, 'Great value and a handy location near the creek. Clean rooms and a friendly team. Good breakfast spread.', 'March 2026'),
  ('hotel', 6, 'Mariam J.', 5, 'Pleasantly surprised by the quality for the price. The pool area is relaxing and the staff went out of their way to help.', 'January 2026');
-- ===== BUNDLES =====
INSERT INTO bundles (title, destination, travelers, airline, flight_no, flight_label, origin, dest_code, depart, arrive, duration, hotel_id, hotel_name, hotel_rating, hotel_reviews, room_type, nights, price, original, img_seed, status) VALUES
  ('Dubai Luxury Escape', 'Dubai, UAE', '2 adults', 'Emirates', 'EK002', 'Emirates · Direct', 'LHR', 'DXB', '08:15', '18:35', '7h 20m', 1, 'Burj Al Arab Jumeirah', 4.9, 2840, 'Deluxe Sea View', 5, 1290, 1680, 159, 'Active'),
  ('Paris City Break', 'Paris, France', '2 adults', 'Air France', 'AF1281', 'Air France · Direct', 'LHR', 'CDG', '09:00', '11:25', '1h 25m', 5, 'Le Meurice', 4.8, 1650, 'Classic Room', 4, 980, 1240, 237, 'Active'),
  ('Tokyo Discovery', 'Tokyo, Japan', '2 adults', 'Singapore Airlines', 'SQ305', 'Singapore Air · 1 stop', 'LHR', 'HND', '21:55', '17:30+1', '14h 35m', 4, 'Park Hyatt Tokyo', 4.9, 2100, 'Park Deluxe King', 7, 1840, 2380, 26, 'Active'),
  ('Bali Retreat', 'Bali, Indonesia', '2 adults', 'Qatar Airways', 'QR015', 'Qatar Airways · 1 stop', 'LHR', 'DPS', '20:10', '19:45+1', '17h 35m', 2, 'COMO Uma Ubud', 4.7, 980, 'Garden Suite', 8, 1420, 1880, 488, 'Active'),
  ('New York Weekender', 'New York, USA', '2 adults', 'British Airways', 'BA177', 'British Airways · Direct', 'LHR', 'JFK', '11:25', '14:20', '7h 55m', 3, 'The Plaza Hotel', 4.6, 3400, 'Plaza Deluxe', 3, 870, 1120, 164, 'Active'),
  ('Maldives Overwater', 'Maldives', '2 adults', 'Emirates', 'EK656', 'Emirates · Direct', 'LHR', 'MLE', '14:30', '23:55', '10h 25m', 6, 'Soneva Jani', 5.0, 760, 'Overwater Villa', 6, 3200, 4100, 15, 'Active');

-- Bundle timeline
INSERT INTO bundle_timeline (bundle_id, step_order, time, label, type, icon) VALUES
  (1, 0, '08:15', 'Depart London Heathrow (LHR)', 'flight', '✈'),
  (1, 1, '18:35', 'Arrive Dubai International (DXB)', 'flight', '🛬'),
  (1, 2, '20:30', 'Check-in: Burj Al Arab Jumeirah', 'hotel', '🏨'),
  (1, 3, 'May 20', 'Check-out from hotel', 'hotel', '🔑'),
  (1, 4, '22:10', 'Depart Dubai International (DXB)', 'flight', '✈'),
  (1, 5, '06:25+1', 'Arrive London Heathrow (LHR)', 'flight', '🛬'),
  (2, 0, '09:00', 'Depart London Heathrow (LHR)', 'flight', '✈'),
  (2, 1, '11:25', 'Arrive Paris Charles de Gaulle (CDG)', 'flight', '🛬'),
  (2, 2, '14:00', 'Check-in: Le Meurice', 'hotel', '🏨'),
  (2, 3, 'May 19', 'Check-out from hotel', 'hotel', '🔑'),
  (2, 4, '19:40', 'Depart Paris (CDG)', 'flight', '✈'),
  (2, 5, '20:05', 'Arrive London Heathrow (LHR)', 'flight', '🛬'),
  (3, 0, '21:55', 'Depart London Heathrow (LHR)', 'flight', '✈'),
  (3, 1, '17:30+1', 'Arrive Tokyo Haneda (HND)', 'flight', '🛬'),
  (3, 2, '19:30', 'Check-in: Park Hyatt Tokyo', 'hotel', '🏨'),
  (3, 3, 'May 22', 'Check-out from hotel', 'hotel', '🔑'),
  (3, 4, '20:00', 'Depart Tokyo (HND)', 'flight', '✈'),
  (3, 5, '05:30+1', 'Arrive London Heathrow (LHR)', 'flight', '🛬'),
  (4, 0, '20:10', 'Depart London Heathrow (LHR)', 'flight', '✈'),
  (4, 1, '19:45+1', 'Arrive Denpasar (DPS)', 'flight', '🛬'),
  (4, 2, '21:30', 'Check-in: COMO Uma Ubud', 'hotel', '🏨'),
  (4, 3, 'May 23', 'Check-out from hotel', 'hotel', '🔑'),
  (4, 4, '21:00', 'Depart Denpasar (DPS)', 'flight', '✈'),
  (4, 5, '06:15+1', 'Arrive London Heathrow (LHR)', 'flight', '🛬'),
  (5, 0, '11:25', 'Depart London Heathrow (LHR)', 'flight', '✈'),
  (5, 1, '14:20', 'Arrive New York (JFK)', 'flight', '🛬'),
  (5, 2, '16:30', 'Check-in: The Plaza Hotel', 'hotel', '🏨'),
  (5, 3, 'May 18', 'Check-out from hotel', 'hotel', '🔑'),
  (5, 4, '21:30', 'Depart New York (JFK)', 'flight', '✈'),
  (5, 5, '09:10+1', 'Arrive London Heathrow (LHR)', 'flight', '🛬'),
  (6, 0, '14:30', 'Depart London Heathrow (LHR)', 'flight', '✈'),
  (6, 1, '23:55', 'Arrive Malé (MLE)', 'flight', '🛬'),
  (6, 2, '08:00+1', 'Check-in: Soneva Jani', 'hotel', '🏨'),
  (6, 3, 'May 21', 'Check-out from hotel', 'hotel', '🔑'),
  (6, 4, '20:30', 'Depart Malé (MLE)', 'flight', '✈'),
  (6, 5, '06:45+1', 'Arrive London Heathrow (LHR)', 'flight', '🛬');

-- Bundle breakdown
INSERT INTO bundle_breakdown (bundle_id, item, price) VALUES
  (1, 'Return flights (2 adults)', 824),
  (1, 'Burj Al Arab · 5 nights', 4900),
  (1, 'Bundle discount', -1016),
  (1, 'Skyora service fee', 82),
  (2, 'Return flights (2 adults)', 420),
  (2, 'Le Meurice · 4 nights', 920),
  (2, 'Bundle discount', -420),
  (2, 'Skyora service fee', 60),
  (3, 'Return flights (2 adults)', 1640),
  (3, 'Park Hyatt · 7 nights', 2100),
  (3, 'Bundle discount', -2000),
  (3, 'Skyora service fee', 100),
  (4, 'Return flights (2 adults)', 1320),
  (4, 'COMO Uma Ubud · 8 nights', 1600),
  (4, 'Bundle discount', -1580),
  (4, 'Skyora service fee', 80),
  (5, 'Return flights (2 adults)', 980),
  (5, 'The Plaza · 3 nights', 1080),
  (5, 'Bundle discount', -1250),
  (5, 'Skyora service fee', 60),
  (6, 'Return flights (2 adults)', 1860),
  (6, 'Soneva Jani · 6 nights', 5400),
  (6, 'Bundle discount', -4200),
  (6, 'Skyora service fee', 140);

-- Bundle reviews
INSERT INTO reviews (type, item_id, name, rating, text, review_date) VALUES
  ('bundle', 1, 'Sarah M.', 5, 'The whole package was seamless — flight, transfer, and hotel all perfectly coordinated. Saved money and stress.', 'March 2026'),
  ('bundle', 1, 'James T.', 5, 'Booking flight and hotel together was so easy. The Burj Al Arab exceeded every expectation. Brilliant value.', 'February 2026'),
  ('bundle', 2, 'Elena V.', 5, 'A perfect romantic getaway. The hotel is steps from the Tuileries and the package price was unbeatable.', 'April 2026'),
  ('bundle', 2, 'Marc D.', 4, 'Lovely short break. Flights were quick and the hotel was elegant. Would book a bundle again.', 'January 2026'),
  ('bundle', 3, 'Yuki S.', 5, 'Dream trip made simple. Everything from the flights to the hotel was first class. The Park Hyatt views are unforgettable.', 'March 2026'),
  ('bundle', 4, 'Nadia F.', 5, 'The most relaxing holiday. The resort is magical and bundling everything together saved us hundreds.', 'April 2026'),
  ('bundle', 4, 'Tom B.', 4, 'Long flights but worth it. Smooth booking and a beautiful hotel deep in the rice fields.', 'February 2026'),
  ('bundle', 5, 'Robert N.', 5, 'Perfect long weekend. Direct flights and an iconic hotel right on Central Park. Effortless from start to finish.', 'March 2026'),
  ('bundle', 6, 'Grace C.', 5, 'Once in a lifetime. The overwater villa was paradise and the package made an expensive trip much more affordable.', 'April 2026'),
  ('bundle', 6, 'Omar A.', 5, 'Flawless. Every detail was handled. The Maldives bundle is worth every penny.', 'January 2026');