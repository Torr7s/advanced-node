import { type Config } from 'jest';

const config: Config = {
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
		'@/tests/(.+)': '<rootDir>/tests/$1',
		'@/(.+)': '<rootDir>/src/$1',
	},
	clearMocks: true,
};
export default config;
