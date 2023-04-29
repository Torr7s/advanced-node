import { type Config } from 'jest';

const jestConfig: Config = {
	roots: ['<rootDir>/src', '<rootDir>/tests'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: [
		'<rootDir>/src/**/*.ts',
		'!<rootDir>/src/main/**',
		'!<rootDir>/src/**/index.ts',
	],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'@tests/(.+)': '<rootDir>/tests/$1',
		'@app/(.+)': '<rootDir>/src/application/$1',
		'@data/(.+)': '<rootDir>/src/data/$1',
		'@domain/(.+)': '<rootDir>/src/domain/$1',
		'@infra/(.+)': '<rootDir>/src/infra/$1',
		'@main/(.+)': '<rootDir>/src/main/$1',
	},
	clearMocks: true,
};

export default jestConfig;
