import { ApiError } from "../utils/ApiError.js";

const validate = (validateSchema) => async (req, res, next) => {
  try {
    const validInfo = await validateSchema.parseAsync(req.body);
    req.body = validInfo;
    next();
  } catch (err) {
    const error = {
      statusCode: 400,
      message: err.errors[0].message,
    };
    next(error);
  }
};

export { validate };
