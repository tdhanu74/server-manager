export class NotRunningError extends Error {
  code = "ERR_INSTANCE_NOT_RUNNING";
  constructor(message: string) {
    super(message);
  }
}
