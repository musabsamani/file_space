import Joi from "joi";

// global file schema and for dynamic usage
const file = {
  tags: Joi.array().items(Joi.string()).required(),
};

export const fileUpload = Joi.object({
  ...file,
});
