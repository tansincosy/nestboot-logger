# @nestboot/logger

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]

[npm-image]: https://img.shields.io/npm/v/@nestboot/logger.svg?style=flat-square

[npm-url]: https://npmjs.org/package/@nsboot/log4js

[downloads-image]: https://img.shields.io/npm/dm/@nestboot/logger.svg?style=flat-square

[downloads-url]: https://npmjs.org/package/@nsboot/log4js



## Description

[log4js-node](https://github.com/log4js-node/log4js-node) module for [Nest](https://github.com/nestjs/nest)

## Installation

```bash
$ npm i --save @nsboot/log4js log4js
```

## Quick Start

- import `LoggerModule` in your root module

```typescript
import { Module } from '@nestjs/common';
import { LoggerModule } from '@nsboot/log4js';
@Module({
  imports: [
    LoggerModule.forRootAsync({
      path: 'logs',
      level: 'info'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

```

- use `LoggerService` in your service

```typescript
import { Injectable } from '@nestjs/common';
import { LoggerService, InjectLogger, ILogger,Logger} from '@nsboot/log4js';

@Injectable()
export class AppService {
  private logger: Logger;
  //must use @InjectLogger() to inject logger
  constructor(@InjectLogger() private readonly iLogger: ILogger) {
    this.logger = this.iLogger.getLogger(AppService.name);
  }
  getHello(): string {
    this.logger.info('getHello');
    return 'Hello World!';
  }
}

``` 
- or use `@Log4j()` decorator in your service

```typescript

import { Injectable } from '@nestjs/common';
import { Logger,Log4j} from '@nsboot/logger';

@Injectable()
export class AppService {
  @Log4j()
  private logger: Logger;
  
  getHello(): string {
    this.logger.info('getHello');
    return 'Hello World!';
  }
}

```

> Note: `@Log4j()` decorator will inject `Logger` instance to your service, so you can use `this.logger` to log.
> If you want to use `@InjectLogger()` decorator, you must use `this.iLogger.getLogger()` to get `Logger` instance.
> 

## Configuration

- `Config`

```typescript

interface Config{
    path?: string;
    level?: string;
    // file name
    name?: string;
    // console show log
    console?: boolean;
}

```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).


## License

Nest is [MIT licensed](LICENSE).