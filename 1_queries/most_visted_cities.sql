SELECT properties.city as city, count(reservations.id) as total
FROM properties
JOIN reservations ON properties.id = reservations.property_id
GROUP BY properties.city
ORDER BY total DESC