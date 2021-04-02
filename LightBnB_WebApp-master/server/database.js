const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool} = require('pg')

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database:'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1;`
  ,[email]).then((res) => {
    return res.rows.length ? res.rows[0]: null
  }); 
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`
  SELECT * 
  FROM users
  WHERE id = $1;`, [id])
  .then((res) => {
    return res.rows.length ? res.rows[0] : null
  });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool.query(`
  INSERT INTO users(name, email, password)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  `, [user.name, user.email, user.password])
  .then((res) => res.rows[0])
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(
    `SELECT properties.*, reservations.*, avg(property_reviews.rating) as average
    FROM reservations
    JOIN property_reviews ON property_reviews.reservation_id = reservations.id
    JOIN properties ON properties.id = reservations.property_id
    WHERE reservations.guest_id = $1 AND reservations.end_date < NOW()::DATE
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT $2;`, [guest_id, limit])
    .then(res => {
      return res.rows
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  let queryParams = [];
  let query = `SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_reviews.property_id `;
  
  let {city, minimum_price_per_night, maximum_price_per_night, minimum_rating} = options;

  let moreOptions = false;
  if (city || minimum_price_per_night || maximum_price_per_night){
    query += `
    WHERE `
  }

  if (city){
    queryParams.push(`%${city}%`);
    query += ` > properties.city LIKE $${queryParams.length} `;
    moreOptions = true;
  }

  if (minimum_price_per_night){
    if (moreOptions) {
      query += 'AND '
    }
    queryParams.push(Number(minimum_price_per_night)*100);
    query += `properties. cost_per_night > $${queryParams.length} `;
    moreOptions = true;
  }

  if (maximum_price_per_night){
    if (moreOptions) {
      query += 'AND '
    }
    queryParams.push(Number(maximum_price_per_night)*100);
    query += `properties.cost_per_night < $${queryParams.length} `;
    moreOptions = true;
  }

  query += `
  GROUP BY properties.id
  `;

  if (minimum_rating){
 
    queryParams.push(minimum_rating);
    query += ` 
    HAVING avg(property_reviews.rating) > $${queryParams.length} 
    `;
  }

  queryParams.push(limit);
  query += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;
  return pool.query(query, queryParams)
    .then (res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  // validate data, throw an error when empty data
  for (let key in property){
    if(!property[key]){
      return Promise().reject('One or more fields are empty');
    }
  }

  let query = `
  INSERT INTO properties(owner_id,title, description, thumbnail_photo_url, cover_photo_url, 
  cost_per_night , parking_spaces, number_of_bathrooms, 
  number_of_bedrooms, country, street, city, province,
  post_code) VALUES `

  

  let paramString = '($1';
  let length = Object.keys(property).length;
  for (let i = 2; i <= length; i++ ){
    paramString += `, $${i}`;
    if (i === length){
      paramString += ')';
    }
  };

  let params = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    Number(property.cost_per_night),
    Number(property.parking_spaces),
    Number(property.number_of_bathrooms),
    Number(property.number_of_bedrooms),
    property.country,
    property.street,
    property.city,
    property.province,
    property.post_code
  ];
  query += paramString;
  query += `
   RETURNING *`;

  return pool.query(query, params).
  then((res) => res.rows[0]);
}
exports.addProperty = addProperty;
