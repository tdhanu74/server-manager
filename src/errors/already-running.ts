export class AlreadyRunningError extends Error {
  constructor(message, code) {
    super(message);
    this.code = "ERR_INSTANCE_RUNNING";
  }
}
