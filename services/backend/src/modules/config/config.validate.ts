import { ConfigFactory } from '@nestjs/config';
import { Config } from './config.types';

const getConfig: ConfigFactory<Config> = () => {
  const env = process.env as any;
  return {
    ...env,
    PORT: parseInt(env.PORT, 10),
    DB_PORT: parseInt(env.DB_PORT, 10),
  };
};

export default getConfig;
