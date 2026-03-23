export class NotFoundError extends Error {
  code = "ERR_NOT_FOUND";
  constructor(message: string) {
    super(message);
  }
}
