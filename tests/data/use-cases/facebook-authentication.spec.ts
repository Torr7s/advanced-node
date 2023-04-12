import { mock, type MockProxy } from 'jest-mock-extended';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook';

import { AuthenticationError } from '@/domain/errors/authentication';

describe('FacebookAuthenticationUseCase', (): void => {
	let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
	let sut: FacebookAuthenticationUseCase;

	beforeEach((): void => {
		loadFacebookUserApi = mock();
		sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);
	});

	it('should call LoadFacebookUserApi with correct input', async (): Promise<void> => {
		await sut.exec({ token: 'fake_random_token' });

		expect(loadFacebookUserApi.exec).toHaveBeenCalledWith({
			token: 'fake_random_token',
		});
		expect(loadFacebookUserApi.exec).toHaveBeenCalledTimes(1);
	});

	it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async (): Promise<void> => {
		loadFacebookUserApi.exec.mockResolvedValueOnce(undefined);

		const authOutput: AuthenticationError = await sut.exec({
			token: 'fake_random_token',
		});

		expect(authOutput).toEqual(new AuthenticationError());
	});
});
