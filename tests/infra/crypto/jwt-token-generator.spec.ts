import jwt from 'jsonwebtoken';

import { type TokenGenerator } from '@/data/contracts/crypto';

jest.mock('jsonwebtoken');

export class JwtTokenGenerator {
	constructor(private readonly secretKey: string) {}

	public async generateToken(input: TokenGenerator.Input): Promise<void> {
		const expirationInSeconds = input.expirationInMs / 1_000;

		jwt.sign(
			{
				key: input.key,
			},
			this.secretKey,
			{
				expiresIn: expirationInSeconds,
			},
		);
	}
}

describe('JwtTokenGenerator', (): void => {
	let sut: JwtTokenGenerator;
	let mockedJwt: jest.Mocked<typeof jwt>;

	beforeAll((): void => {
		mockedJwt = jwt as jest.Mocked<typeof jwt>;
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
});
