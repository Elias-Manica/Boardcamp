import Joi from "joi";

const rentalsSchema = Joi.object({
  customerId: Joi.number().required().messages({
    "any.required": "Passar o customerId é obrigatório",
    "number.base": "O customerId deve ser um numero",
  }),
  gameId: Joi.number().required().messages({
    "any.required": "Passar o gameId é obrigatório",
    "number.base": "O gameId deve ser um numero",
  }),
  daysRented: Joi.number().required().min(1).integer().messages({
    "any.required": "Passar o daysRented é obrigatório",
    "number.base": "O daysRented deve ser um numero",
    "number.min": `daysRented deve ser maior que 0`,
    "number.integer": "daysRented deve ser um inteiro",
  }),
});

export { rentalsSchema };
