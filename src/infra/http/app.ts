import express from 'express';

import { setupAppMiddlewares } from '@main/config/middlewares';
import { setupAppRoutes } from '@main/config/routes';

const app: express.Express = express();

setupAppMiddlewares(app);
setupAppRoutes(app);

export default app;
