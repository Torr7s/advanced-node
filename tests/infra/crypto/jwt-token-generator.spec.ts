import jwt from 'jsonwebtoken';

import { JwtTokenGenerator } from '@/infra/crypto';

jest.mock('jsonwebtoken');

describe('JwtTokenGenerator', (): void => {
	let sut: JwtTokenGenerator;
	let mockedJwt: jest.Mocked<typeof jwt>;

	beforeAll((): void => {
		mockedJwt = jwt as jest.Mocked<typeof jwt>;
		mockedJwt.sign.mockImplementation((): string => 'any_token');
	});

	beforeEach((): void => {
		sut = new JwtTokenGenerator('any_secret_key');
	});

	it('should call jwt.sign with correct params', async (): Promise<void> => {
		await sut.generateToken({
			key: 'any_key',
			expirationInMs: 1_000_000,
		});

		expect(mockedJwt.sign).toHaveBeenCalledWith(
			{ key: 'any_key' },
			'any_secret_key',
			{
				expiresIn: 1_000,
			},
		);
	});

	it('should return a token on success', async (): Promise<void> => {
		const token: string = await sut.generateToken({
			key: 'any_key',
			expirationInMs: 1_000_000,
		});

		expect(token).toBe('any_token');
	});

	it('should rethrow if jwt.sign throws', async (): Promise<void> => {
		mockedJwt.sign.mockImplementationOnce((): never => {
			throw new Error('token_error');
		});

		const promise = sut.generateToken({
			key: 'any_key',
			expirationInMs: 1_000_000,
		});

		await expect(promise).rejects.toThrow(new Error('token_error'));
	});
});
