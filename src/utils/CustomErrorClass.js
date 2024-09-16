export class CustomError extends Error {
  constructor(technicalDetails, message, statusCode) {
    super(message);
    this.message = message;
    this.technicalDetails = technicalDetails;
    this.statusCode = statusCode;
  }

  ToJson() {
    return {
      message: this.message,
      technicalDetails: this.technicalDetails,
      statusCode: this.statusCode,
    };
  }
}
