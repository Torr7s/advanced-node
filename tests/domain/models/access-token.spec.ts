import { AccessToken } from '@domain/models';

describe('AccessToken Model', (): void => {
	it('should create with a value', (): void => {
		const sut = new AccessToken('any_token_value');

		expect(sut).toEqual({
			value: 'any_token_value',
		});
	});

	it('should expire in 1_800_000 ms', (): void => {
		expect(AccessToken.expirationInMs).toBe(1_800_000);
	});
});
