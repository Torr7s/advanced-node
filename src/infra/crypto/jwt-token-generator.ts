import jwt from 'jsonwebtoken';

import { type TokenGenerator } from '@/data/contracts/crypto';

export class JwtTokenGenerator implements TokenGenerator {
	constructor(private readonly secretKey: string) {}

	public async generateToken(
		input: TokenGenerator.Input,
	): Promise<TokenGenerator.Output> {
		const expirationInSeconds: number = input.expirationInMs / 1_000;

		return jwt.sign(
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
