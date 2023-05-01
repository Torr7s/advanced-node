import 'reflect-metadata';

import '../../main/config/module-alias';

import app from './app';

import { env } from '@main/config/env';

app.listen(env.app.port, (): void =>
	console.log(`Server running at http://localhost:${env.app.port}`),
);
