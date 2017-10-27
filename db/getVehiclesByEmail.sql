SELECT vehicles.id, make, model, year FROM vehicles INNER JOIN users ON vehicles.owner_id = users.id WHERE users.email = $1;
