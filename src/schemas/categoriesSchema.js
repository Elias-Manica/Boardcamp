import Joi from "joi";

const categoriesSchema = Joi.object({
  name: Joi.string()
    .required()
    .regex(/[a-zA-Z0-9]/)
    .empty("")
    .messages({
      "string.empty": "O name não pode ser vazio",
      "string.base": "O name deve ser um texto",
      "any.required": "Passar o name é obrigatório",
      "any.default": "teste",
      "object.regex": "Esse name não deve ser utilizado",
      "string.pattern.base": "O name deve ter pelo menos uma letra",
    }),
});

export { categoriesSchema };
