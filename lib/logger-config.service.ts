import { Configuration } from 'log4js';
import { LogConfig } from './interfaces/logger.interface';

const layout = {
  type: 'pattern',
  pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m',
};

const interfaceLayout = {
  type: 'pattern',
  pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] - %m',
};

const getLogFilePath = (params: LogConfig) => {
  const { path, name } = params;
  return {
    run: `${path}/run/r${name}.log`,
    debug: `${path}/debug/${name}/d${name}.log`,
    interface: `${path}/interface/i${name}.log`,
  };
};

export class LoggerConfigService {
  constructor(private readonly logConfig: LogConfig) {}

  loader(): Configuration {
    const logPathMaps = getLogFilePath(this.logConfig);
    return {
      appenders: {
        console: {
          type: 'console',
          layout: {
            type: 'pattern',
            pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c -%] %m',
          },
          level: 'debug',
        },
        rApp: {
          type: 'dateFile',
          filename: logPathMaps.run,
          pattern: 'yyyy-MM-dd',
          maxLogSize: '10M',
          keepFileExt: true,
          compress: true,
          layout,
        },
        dApp: {
          type: 'dateFile',
          filename: logPathMaps.debug,
          pattern: 'yyyy-MM-dd',
          maxLogSize: '10M',
          keepFileExt: true,
          compress: true,
          layout,
        },
        interface: {
          type: 'dateFile',
          filename: logPathMaps.interface,
          pattern: 'yyyy-MM-dd',
          maxLogSize: '10M',
          keepFileExt: true,
          compress: true,
          interfaceLayout,
        },
        rAppLoggerFilter: {
          type: 'logLevelFilter',
          appender: 'rApp',
          level: 'info',
        },
        dAppLoggerFilter: {
          type: 'logLevelFilter',
          appender: 'dApp',
          level: this.logConfig.level === 'debug' ? 'debug' : 'off',
        },
      },
      categories: {
        default: {
          appenders: this.logConfig.console
            ? ['console', 'rAppLoggerFilter', 'dAppLoggerFilter']
            : ['rAppLoggerFilter', 'dAppLoggerFilter'],
          level: this.logConfig.level || 'info',
        },
        interface: {
          appenders: this.logConfig.console
            ? ['console', 'interface']
            : ['interface'],
          level: 'info',
        },
      },
    };
  }
}
