import path from 'node:path';

import moduleAlias from 'module-alias';

moduleAlias.addAlias('@', path.resolve('dist'));
