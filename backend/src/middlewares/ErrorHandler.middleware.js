const ErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const response = {
      statusCode: statusCode,  
      message: err.message || "Something went wrong",
      errors: err.errors || []
    };
  
    res.status(statusCode).json(response);
  }

  export {ErrorHandler}