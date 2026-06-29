import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';

let appPromise: Promise<express.Express>;

async function getApp(): Promise<express.Express> {
  if (!appPromise) {
    appPromise = (async () => {
      const server = express();
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
      );

      app.setGlobalPrefix('api');

      app.enableCors({
        origin: process.env.VERCEL ? true : (process.env.FRONTEND_URL || 'http://localhost:5173'),
        credentials: true,
      });

      app.use(helmet());
      app.use(compression());
      app.use(cookieParser());

      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
        }),
      );

      await app.init();
      return server;
    })();
  }
  return appPromise;
}

if (!process.env.VERCEL) {
  getApp().then(server => {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  });
}

export default async (req: express.Request, res: express.Response) => {
  const server = await getApp();
  return server(req, res);
};
