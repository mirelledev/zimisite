import { body, ValidationChain } from "express-validator";

export const userCreateValidation = (): ValidationChain[] => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório")
      .isLength({ min: 5, max: 60 })

      .withMessage(
        "O nome não pode passar de 60 caracteres. Se preciso, escreva abreviado."
      ),
    body("username")
      .isString()
      .withMessage("O seu @username é obrigatório")
      .isLength({ min: 4, max: 18 })
      .withMessage("O máximo de caracteres permitido no @username é 18")
      .custom((value, { req }) => {
        const username = value.startsWith("@") ? value.substring(1) : value;
        if (username.includes(" ")) {
          throw new Error("No username não pode ter espaços");
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          throw new Error(
            "O @username só pode conter letras, números e underscores"
          );
        }
        return true;
      }),

    body("email")
      .isString()
      .withMessage("O e-mail é obrigatório")
      .isEmail()
      .withMessage("Digite um e-mail válido"),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter pelo menos 5 caracteres"),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas não são iguais");
        }
        return true;
      }),
  ];
};

export const loginUserValidation = (): ValidationChain[] => {
  return [
    body("email")
      .isString()
      .withMessage("O email é obrigatório")
      .isEmail()
      .withMessage("Insira um e-mail válido"),
    body("password").isString().withMessage("A senha é obrigatória"),
  ];
};

export const userUpdateValidation = (): ValidationChain[] => {
  return [
    body("name")
      .optional()
      .isLength({ min: 5 })
      .withMessage("O nome precisa ter pelo menos 5 caracteres"),
    body("password")
      .optional()
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter pelo menos 5 caracteres"),
    body("username")
      .optional()
      .isLength({ min: 4 })
      .withMessage("O @username precisa ter pelo menos 4 caracteres")
      .isLength({ max: 18 })
      .withMessage("O máximo de caracteres permitido no @username é 18.")
      .custom((value, { req }) => {
        const username = value.startsWith("@") ? value.substring(1) : value;
        if (username.includes(" ")) {
          throw new Error("No username não pode ter espaços");
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          throw new Error(
            "O @username só pode conter letras, números e underscores"
          );
        }
        return true;
      }),
  ];
};
