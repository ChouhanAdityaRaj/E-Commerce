const ErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode;

    const response = {
      statusCode: err.statusCode,  
      message: err.message
    };
  
    res.status(statusCode).json(response);
  }

  export {ErrorHandler}