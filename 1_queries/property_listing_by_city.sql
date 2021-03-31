SELECT properties.id, properties.title, average 
FROM 
(SELECT property_id, avg(property_reviews.rating) as average
FROM property_reviews
GROUP BY property_id) AS average
JOIN properties ON properties.id = average.property_id
WHERE properties.city LIKE '%Vancouver%' AND average >= 4
ORDER BY cost_per_night
LIMIT 10