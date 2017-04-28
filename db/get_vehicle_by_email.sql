SELECT *
FROM vehicles v
Full JOIN users u
ON v.ownerid = u.id
WHERE email = $1
