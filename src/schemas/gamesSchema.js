import Joi from "joi";

const gamesSchema = Joi.object({
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
  image: Joi.string()
    .required()
    .regex(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    )
    .empty("")
    .messages({
      "string.empty": "O image não pode ser vazia",
      "string.base": "O image deve ser uma string",
      "any.required": "Passar a image é obrigatório",
      "object.regex": "Essa url não deve ser utilizada",
      "string.pattern.base": "A url deve ser válida",
    }),
  stockTotal: Joi.number().required().min(1).integer().messages({
    "any.required": "Passar o stockTotal é obrigatório",
    "number.base": "O stockTotal deve ser um numero",
    "number.min": `stockTotal deve ser maior que 0`,
    "number.integer": "stockTotal deve ser um inteiro",
  }),
  categoryId: Joi.number().required().messages({
    "any.required": "Passar o stockTotal é obrigatório",
    "number.base": "O stockTotal deve ser um numero",
  }),
  pricePerDay: Joi.number().required().min(1).messages({
    "any.required": "Passar o pricePerDay é obrigatório",
    "number.base": "O pricePerDay deve ser um numero",
    "number.min": `pricePerDay deve ser maior que 0`,
  }),
});

export { gamesSchema };
