UPDATE vehicles
SET ownerId = null
WHERE id = $2 AND ownerId = $1
