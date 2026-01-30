export class NotRunningError extends Error {
  constructor(message, code) {
    super(message);
    this.code = "ERR_INSTANCE_NOT_RUNNING";
  }
}
