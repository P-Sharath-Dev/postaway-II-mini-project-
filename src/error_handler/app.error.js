export default class ApplicationError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const appLevelErrorHandlerMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  err.message = err.message || "server error! Try later!!";

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
