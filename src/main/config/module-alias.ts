import path from 'node:path';

import moduleAlias from 'module-alias';

const files: string = path.resolve(__dirname, '../../..');

moduleAlias.addAliases({
	'@app': path.join(files, 'dist/application'),
	'@data': path.join(files, 'dist/data'),
	'@domain': path.join(files, 'dist/domain'),
	'@infra': path.join(files, 'dist/infra'),
	'@main': path.join(files, 'dist/main'),
});
