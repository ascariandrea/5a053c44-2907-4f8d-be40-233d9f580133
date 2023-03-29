import { Injectable } from '@nestjs/common';
import { ConfigService as NestJSConfigService } from '@nestjs/config';
import { Config } from './config.types';

@Injectable()
export class ConfigService extends NestJSConfigService<Config> {}
