import connection from "../database/database.js";

import { categoriesSchema } from "../schemas/categoriesSchema.js";

async function getCategories(req, res) {
  try {
    const response = await connection.query("SELECT * FROM categories;");
    res.send(response.rows);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

async function postCategories(req, res) {
  try {
    const { name } = req.body;

    const isValid = categoriesSchema.validate(req.body, { abortEarly: false });

    if (isValid.error) {
      const error = isValid.error.details.map((error) => error.message);
      res.status(400).send(error);
      return;
    }

    const response = await connection.query(
      "SELECT * FROM categories WHERE name=$1;",
      [name]
    );

    if (response.rows.length > 0) {
      res
        .status(409)
        .send({ msg: `Já existe uma categoria com o name igual a ${name}` });
      return;
    }

    await connection.query("INSERT INTO categories (name) VALUES ($1);", [
      name,
    ]);

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

export { getCategories, postCategories };
