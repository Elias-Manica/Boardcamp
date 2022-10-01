import connection from "../database/database.js";

import { gamesSchema } from "../schemas/gamesSchema.js";

async function getGames(req, res) {
  const name = req.query.name;

  if (!name) {
    const response = await connection.query("SELECT * FROM games;");
    res.send(response.rows);
    return;
  }

  const response = await connection.query(
    "SELECT * FROM games WHERE name LIKE $1;",
    [name + "%"]
  );
  res.send(response.rows);
}

async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const isValid = gamesSchema.validate(req.body, { abortEarly: false });

  if (isValid.error) {
    const error = isValid.error.details.map((error) => error.message);
    res.status(400).send(error);
    return;
  }

  const response = await connection.query(
    "SELECT * FROM games WHERE name=$1;",
    [name]
  );

  if (response.rows.length > 0) {
    res
      .status(409)
      .send({ msg: `Já existe um jogo com o name igual a ${name}` });
    return;
  }

  const responseID = await connection.query(
    "SELECT * FROM categories WHERE id=$1;",
    [categoryId]
  );

  if (responseID.rows.length === 0) {
    res
      .status(400)
      .send({ msg: `Não há uma categoria com esse ID ${categoryId}` });
    return;
  }

  await connection.query(
    'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);',
    [name, image, stockTotal, categoryId, pricePerDay]
  );

  res.sendStatus(201);
}

export { getGames, postGames };
