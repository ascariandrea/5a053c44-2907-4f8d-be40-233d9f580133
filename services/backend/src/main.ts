// /**
//  * Load ts config paths as valid node_modules
//  */
// import moduleAlias from 'module-alias';
// moduleAlias(process.cwd());

/**
 * Imports
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
}
bootstrap();
