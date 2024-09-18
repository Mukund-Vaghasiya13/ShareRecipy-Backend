import { CustomError } from "./CustomErrorClass.js";

const asyncHandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((e) => {
      if (e instanceof CustomError) {
        res.status(e.statusCode).json(e.ToJson());
      } else {
        console.error(e);
        res.status(500).json({
          message: e.message || "Internal Server Error",
          statusCode: 500,
        });
      }
    });
  };
};

export { asyncHandler };
