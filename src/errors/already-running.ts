export class AlreadyRunningError extends Error {
  code = "ERR_INSTANCE_RUNNING";
  constructor(message: string) {
    super(message);
  }
}
