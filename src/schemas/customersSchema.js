import Joi from "joi";

const customersSchema = Joi.object({
  name: Joi.string()
    .required()
    .regex(/[a-zA-Z0-9]/)
    .empty("")
    .messages({
      "string.empty": "O name não pode ser vazio",
      "string.base": "O name deve ser um texto",
      "any.required": "Passar o name é obrigatório",
      "object.regex": "Esse name não deve ser utilizado",
      "string.pattern.base": "O name deve ter pelo menos uma letra",
    }),
  phone: Joi.string().min(10).max(11).required().messages({
    "any.required": "Passar o phone é obrigatório",
    "string.base": "O phone deve ser uma string",
    "string.min": `phone deve ser ter no mínimo 10 números`,
    "string.max": `phone deve ser ter no máximo 11 números`,
  }),
  cpf: Joi.string()
    .required()
    .regex(/^\d{11}$/)
    .messages({
      "any.required": "Passar o cpf é obrigatório",
      "string.base": "O cpf deve ser uma string",
      "string.pattern.base": "O cpf deve ter 11 números",
    }),
  birthday: Joi.string()
    .required()
    .regex(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
    .messages({
      "any.required": "Passar o birthday é obrigatório",
      "string.base": "O birthday deve ser uma string",
      "string.pattern.base": "O birthday deve ter o formato YYYY-MM-DD",
    }),
});

export { customersSchema };
