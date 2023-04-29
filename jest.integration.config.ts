import { type Config } from 'jest';

import jestConfig from './jest.config';

const jestIngrationConfig: Config = {
	...jestConfig,
	testRegex: '.*\\.test\\.ts$',
};

export default jestIngrationConfig;
