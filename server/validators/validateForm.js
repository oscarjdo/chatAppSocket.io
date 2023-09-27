import { check } from "express-validator";
import validateData from "./validateData.js";

const validateForm = [
  check("username").exists().notEmpty().isLength({ min: 3 }),
  check("email").exists().notEmpty().isEmail(),
  check("password").exists().notEmpty().isLength({ min: 8 }),
  (req, res, next) => {
    validateData(req, res, next);
  },
];

export default validateForm;
