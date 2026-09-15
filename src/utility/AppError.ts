export class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, messege: string) {
    super(messege); //throw new Error(messege)
    this.statusCode = statusCode;
    // if (stack) {
    //   this.stack = stack;
    // } else {
    //   Error.captureStackTrace(this, this.constructor);
    // }
  }
}
