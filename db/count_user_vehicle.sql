SELECT COUNT(ownerid)
FROM vehicles
WHERE ownerid = $1;
