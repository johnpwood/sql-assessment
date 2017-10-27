SELECT vehicles.id, vehicles.make, vehicles.model, vehicles.year FROM vehicles INNER JOIN users ON users.id = vehicles.owner_id WHERE users.name LIKE $1;
