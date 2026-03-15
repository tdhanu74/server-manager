export class NotFoundError extends Error {
  constructor(message, code) {
    super(message);
    this.code = "ERR_NOT_FOUND";
  }
}
