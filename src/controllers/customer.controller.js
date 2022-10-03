import connection from "../database/database.js";

import { customersSchema } from "../schemas/customersSchema.js";

async function getCustomer(req, res) {
  try {
    const cpf = req.query.cpf;

    if (!cpf) {
      const response = await connection.query("SELECT * FROM customers;");
      res.send(response.rows);
      return;
    }

    const response = await connection.query(
      "SELECT * FROM customers WHERE cpf LIKE $1;",
      [cpf + "%"]
    );
    res.send(response.rows);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

async function getCustomerByID(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).send({ msg: "É necessário o ID do usuário" });
      return;
    }

    const response = await connection.query(
      "SELECT * FROM customers WHERE id=$1;",
      [id]
    );

    if (response.rows.length === 0) {
      res.sendStatus(404);
      return;
    }
    res.send(response.rows[0]);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

async function postCustomers(req, res) {
  try {
    const { name, phone, cpf, birthday } = req.body;

    const isValid = customersSchema.validate(req.body, { abortEarly: false });

    if (isValid.error) {
      const error = isValid.error.details.map((error) => error.message);
      res.status(400).send(error);
      return;
    }

    const response = await connection.query(
      "SELECT * FROM customers WHERE cpf=$1;",
      [cpf]
    );

    if (response.rows.length > 0) {
      res
        .status(409)
        .send({ msg: `Já existe um usuário com o cpf igual a ${cpf}` });
      return;
    }

    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);",
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

async function updateCustomers(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    if (!id) {
      res.status(400).send({ msg: "É necessário o ID do usuário" });
      return;
    }

    const isValid = customersSchema.validate(req.body, { abortEarly: false });

    if (isValid.error) {
      const error = isValid.error.details.map((error) => error.message);
      res.status(400).send(error);
      return;
    }

    const response = await connection.query(
      "SELECT * FROM customers WHERE cpf=$1;",
      [cpf]
    );

    if (response.rows.length > 0) {
      if (Number(response.rows[0].id) !== Number(id)) {
        res
          .status(409)
          .send({ msg: `Já existe um usuário com o cpf igual a ${cpf}` });
        return;
      }
    }

    await connection.query(
      "UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5;",
      [name, phone, cpf, birthday, id]
    );

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send({ msg: "Erro no servidor" });
  }
}

export { getCustomer, postCustomers, getCustomerByID, updateCustomers };
