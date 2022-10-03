import dayjs from "dayjs";
import connection from "../database/database.js";

import { rentalsSchema } from "../schemas/rentalsSchema.js";

async function getRentals(req, res) {
  try {
    const customerId = req.query.customerId;
    const gameId = req.query.gameId;

    if (customerId && !gameId) {
      const response = await connection.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS "customers", json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON categories.id = games."categoryId" WHERE rentals."customerId" = $1 GROUP  BY rentals.id, customers.id, games.id, categories.name;`,
        [customerId]
      );
      res.send(response.rows);
      return;
    }

    if (!customerId && gameId) {
      const response = await connection.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS "customers", json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON categories.id = games."categoryId" WHERE rentals."gameId" = $1 GROUP  BY rentals.id, customers.id, games.id, categories.name;`,
        [gameId]
      );
      res.send(response.rows);
      return;
    }

    if (customerId && gameId) {
      const response = await connection.query(
        `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS "customers", json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON categories.id = games."categoryId" WHERE rentals."gameId" = $1 AND rentals."customerId" = $2 GROUP  BY rentals.id, customers.id, games.id, categories.name;`,
        [gameId, customerId]
      );

      res.send(response.rows);
      return;
    }

    const teste = await connection.query(
      `SELECT rentals.*, json_build_object('id', customers.id, 'name', customers.name) AS "customers", json_build_object('id', games.id, 'name', games.name, 'categoryId', games."categoryId", 'categoryName', categories.name) AS "game" FROM rentals JOIN customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON categories.id = games."categoryId";`
    );
    res.send(teste.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

async function postRentals(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;

    const isValid = rentalsSchema.validate(req.body, { abortEarly: false });

    if (isValid.error) {
      const error = isValid.error.details.map((error) => error.message);
      res.status(400).send(error);
      return;
    }

    const responseCustomer = await connection.query(
      "SELECT * FROM customers WHERE id=$1;",
      [customerId]
    );

    if (responseCustomer.rows.length === 0) {
      res.status(400).send({ msg: `Esse cliente não existe` });
      return;
    }

    const responseGame = await connection.query(
      "SELECT * FROM games WHERE id=$1;",
      [gameId]
    );

    if (responseGame.rows.length === 0) {
      res.status(400).send({ msg: `Não há um jogo com esse ID ${gameId}` });
      return;
    }

    const responseStock = await connection.query(
      `SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`,
      [gameId]
    );

    if (responseStock) {
      if (responseStock.rows.length >= responseGame.rows[0].stockTotal) {
        res.status(400).send({ msg: `Não há estoque disponivel no momento` });
        return;
      }
    }

    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        customerId,
        gameId,
        dayjs(Date.now()).format("YYYY-MM-DD"),
        daysRented,
        null,
        Number(
          `${Number(daysRented) * Number(responseGame.rows[0].pricePerDay)}`
        ),
        null,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

async function endRental(req, res) {
  try {
    const { id } = req.params;

    const hasRental = await connection.query(
      `SELECT * FROM rentals WHERE id=$1;`,
      [id]
    );

    if (hasRental.rows.length === 0) {
      res.status(404).send({ msg: `Aluguel não encontrado` });
      return;
    }

    if (hasRental.rows[0].returnDate) {
      res.status(400).send({ msg: `Aluguel já finalizado` });
      return;
    }

    const date1 = dayjs(`${hasRental.rows[0].rentDate}`);
    const date2 = dayjs();
    const diff = date2.diff(date1, "day", true);
    const days = Math.floor(diff);

    if (days > hasRental.rows[0].daysRented) {
      const daysfee = Number(days) - Number(hasRental.rows[0].daysRented);
      const originalPrice =
        Number(hasRental.rows[0].originalPrice) /
        Number(hasRental.rows[0].daysRented);
      const fee = daysfee * originalPrice;

      const reponse = await connection.query(
        `UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3;`,
        [dayjs(Date.now()).format("YYYY-MM-DD"), fee, id]
      );
      res.sendStatus(200);
      return;
    }

    const reponse = await connection.query(
      `UPDATE rentals SET "returnDate"=$1, "delayFee"=0 WHERE id=$2;`,
      [dayjs(Date.now()).format("YYYY-MM-DD"), id]
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

async function deleteRental(req, res) {
  try {
    const { id } = req.params;

    const hasRental = await connection.query(
      `SELECT * FROM rentals WHERE id=$1;`,
      [id]
    );

    if (hasRental.rows.length === 0) {
      res.status(404).send({ msg: `Aluguel não encontrado` });
      return;
    }

    if (hasRental.rows[0].returnDate === null) {
      res.status(400).send({ msg: `Aluguel não finalizado` });
      return;
    }

    await connection.query(`DELETE FROM rentals WHERE id=$1;`, [id]);

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

export { getRentals, postRentals, endRental, deleteRental };
