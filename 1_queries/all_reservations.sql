SELECt properties.id, properties.title, reservations.start_date AS start, avg(property_reviews.rating) as average
FROM reservations
JOIN property_reviews ON property_reviews.reservation_id = reservations.id
JOIN properties ON properties.id = reservations.property_id
WHERE reservations.guest_id = 1 AND reservations.end_date < NOW()::DATE
GROUP BY properties.id, start
ORDER BY start
LIMIT 10