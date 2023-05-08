import { bodyParser, contentType, staticFolder, staticRoute } from '@main/middleware';
import cors from 'cors';
import type { Express } from 'express';

export const setupMiddleware = (app: Express): void => {
  app.use(bodyParser);
  app.use(contentType);
  app.use(cors());
  app.use(staticRoute, staticFolder);
};
