import { type Log } from "@/types";
import { type Logger } from "winston";
import { ChildProcessWithoutNullStreams } from "child_process";

export interface ServerInstance {
  id: string;
  name: string;
  logs: Log[];
  entrypoint: string;
  maxlimit?: number;
  running?: boolean;
  instance: ChildProcessWithoutNullStreams | undefined;
  logLocation: string;
  logger: Logger | undefined;

  start(): void;
  input?(input: string): void;
  stop(): void;
  getLogs(): Log[];
}
