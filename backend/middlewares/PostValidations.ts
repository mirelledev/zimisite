import { body, ValidationChain } from "express-validator";

export const addPostValidation = (): ValidationChain[] => {
  return [
    body("text")
      .isString()
      .withMessage("A postagem não pode ser vazia")
      .not()
      .equals("undefined")
      .withMessage("A postagem não pode ser vazia")
      .isLength({ max: 200 })
      .withMessage("A postagem tem um limite de 200 caracteres"),
  ];
};

export const commentValidation = () => {
  return [body("comment").isString().withMessage("O comentário é obrigatório")];
};
