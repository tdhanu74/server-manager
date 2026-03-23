export type Server = {
  id?: string;
  name: string;
  type: string;
  running?: boolean;
  maxlimit?: number;
  entrypoint: string;
};
