import { validationResult } from "express-validator";

const validateData = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (error) {
    res.json(error.array());
  }
};

export default validateData;
