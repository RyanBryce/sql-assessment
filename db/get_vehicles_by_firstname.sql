SELECT * FROM vehicles
JOIN users ON users.id = vehicles.ownerId
WHERE users.firstname LIKE $1
