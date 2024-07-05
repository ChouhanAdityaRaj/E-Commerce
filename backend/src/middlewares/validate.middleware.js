import { ApiError } from "../utils/ApiError.js";
import fs from "fs";

const validate = (validateSchema) => async (req, res, next) => {
  try {
    const validInfo = await validateSchema.parseAsync(req.body);
    req.body = validInfo;
    next();
  } catch (err) {

    if(req.files){
      for (const fieldName in req.files) {
        req.files[fieldName].forEach(img => {
          fs.unlinkSync(img.path);
        });
      }
    }

    const error = {
      statusCode: 400,
      message: err.errors[0].message,
    };
    next(error);
  }
};

export { validate };
