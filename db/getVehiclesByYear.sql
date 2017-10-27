SELECT vehicles.id, vehicles.make, vehicles.model, vehicles.year, users.name FROM vehicles INNER JOIN users ON users.id = vehicles.owner_id WHERE vehicles.year > 2000 ORDER BY vehicles.year DESC;
