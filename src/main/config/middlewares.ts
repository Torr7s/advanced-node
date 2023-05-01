import cors from 'cors';
import { type Express, type NextFunction, type Response, json } from 'express';

export const setupAppMiddlewares = (app: Express): void => {
	app.use(json());

	app.use(
		cors({
			allowedHeaders: ['content-type'],
			origin: 'http://localhost:8080',
			credentials: true,
		}),
	);

	app.use((_: any, res: Response, next: NextFunction): void => {
		res.type('json');

		next();
	});
};
