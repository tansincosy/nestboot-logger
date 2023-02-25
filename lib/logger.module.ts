import { configure, Log4js } from 'log4js';
import {
  DynamicModule,
  Global,
  Module,
  Provider,
  OnModuleInit,
} from '@nestjs/common';
import { LoggerConfigService } from './logger-config.service';
import {
  CONFIG,
  LOG_CONFIG_KEY,
  LOG_CONFIG_OPTIONS,
  LOG_METADATA,
  LOG_METADATA_CONFIG,
  LOG_PROVIDER,
} from './logger.constant';
import { NestLoggerService } from './logger-nest.service';
import { DiscoveryModule, DiscoveryService, Reflector } from '@nestjs/core';
import { InjectLogger } from './decorators/logger.inject';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { isFunction, isUndefined } from 'lodash';
import { ConfigService } from './interfaces/config.interface';
import { ILogger, LogConfig } from './interfaces/logger.interface';

@Global()
@Module({})
export class LoggerModule implements OnModuleInit {
  constructor(
    @InjectLogger() private readonly iLogger: ILogger,
    private readonly discoveryService: DiscoveryService,
  ) {}

  static forRootAsync(options: LogConfig): DynamicModule {
    const inject = options.inject || [];
    const optionsProvider = {
      provide: LOG_CONFIG_OPTIONS,
      useFactory: (...params: any[]) => {
        const registerOptions = options;
        const configService: ConfigService = params[inject.indexOf(CONFIG)];
        if (configService) {
          const configYAML = configService.get<LogConfig>(LOG_CONFIG_KEY);
          options = {
            ...configYAML,
          };
        }
        return Object.assign(registerOptions, options);
      },
      inject,
    };

    const loggerProvider: Provider = {
      provide: LOG_PROVIDER,
      useFactory: (options: LogConfig): Log4js => {
        const logConfigService = new LoggerConfigService(options);
        return configure(logConfigService.loader());
      },
      inject: [LOG_CONFIG_OPTIONS],
    };

    return {
      module: LoggerModule,
      imports: [DiscoveryModule],
      providers: [loggerProvider, optionsProvider, NestLoggerService],
      exports: [loggerProvider, NestLoggerService],
    };
  }

  /**
   * 1. 获取所有的 providers
   * 2. 获取所有的 controllers
   * 3. 遍历 providers 和 controllers
   * 4. 获取每个实例的所有属性
   * 5. 判断属性是否有 @Log() 装饰器
   * 6. 如果有，获取 @Log() 装饰器的参数
   * 7. 将参数作为 logger 的 name
   *
   */
  onModuleInit() {
    const providers: InstanceWrapper[] = [
      ...this.discoveryService.getProviders(),
      ...this.discoveryService.getControllers(),
    ];
    providers.forEach((wrapper: InstanceWrapper) => {
      const { instance, name } = wrapper;
      if (!instance || typeof instance === 'string') {
        return;
      }
      for (const propertyKey in instance) {
        if (isFunction(propertyKey)) {
          continue;
        }
        const property = String(propertyKey);
        const isLog = Reflect.getMetadata(LOG_METADATA, instance, property);
        if (isUndefined(isLog)) {
          continue;
        }
        const metadata = Reflect.getMetadata(
          LOG_METADATA_CONFIG,
          instance,
          property,
        );
        instance[property] = this.iLogger.getLogger(metadata || name);
      }
    });
  }
}
