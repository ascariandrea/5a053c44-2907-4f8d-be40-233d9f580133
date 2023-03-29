import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';

const logger = new Logger('MikroORM');

export const getConfig = () => {
  const config: Options = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    type: 'postgresql',
    port: parseInt(process.env.DB_PORT as any, 10),
    highlighter: new SqlHighlighter(),
    debug: process.env.DB_DEBUG === '1' ?? false,
    logger: logger.log.bind(logger),
    entities: [__dirname + '/entities/*.entity.js'],
    entitiesTs: [__dirname + '/entities/*.entity.ts'],
    // metadataProvider: TsMorphMetadataProvider,
    extensions: [Migrator],
  };

  return config;
};

export default getConfig();
