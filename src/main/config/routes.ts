import fs from 'node:fs';
import path from 'node:path';

import { type Express, Router } from 'express';

export const setupAppRoutes = (app: Express): void => {
	const router = Router();

	fs.readdirSync(
		path.join(__dirname, '..', '..', 'infra', 'http/presentation', 'routes'),
	)
		.filter((file) => !file.endsWith('.map'))
		.map(async (file) => {
			(await import(`../../infra/http/presentation/routes/${file}`)).default(
				router,
			);
		});

	app.use(router);
};
