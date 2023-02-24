import { Logger as Log4Logger, Log4js } from 'log4js';

export interface LogConfig {
  path?: string;
  level?: string;
  inject?: any[];
  name?: string;
  console?: boolean;
}

export type Logger = Log4Logger;

export type ILogger = Log4js;
