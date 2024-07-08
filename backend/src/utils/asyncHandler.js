import fs from "fs";

const asyncHandler = (requestHadler) => {
  return (req, res, next) => {
    Promise
        .resolve(requestHadler(req, res, next))
        .catch((err) => {
          if(req.files){
            for (const fieldName in req.files) {
              req.files[fieldName].forEach(img => {
                fs.unlinkSync(img.path);
              });
            }
          }
          next(err)
        });
  };
};

export { asyncHandler };