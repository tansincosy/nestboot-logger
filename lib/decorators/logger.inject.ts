import { Inject } from '@nestjs/common';
import { LOG_PROVIDER } from '../logger.constant';

export const InjectLogger = () => Inject(LOG_PROVIDER);
