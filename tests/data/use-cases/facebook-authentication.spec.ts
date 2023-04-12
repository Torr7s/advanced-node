import { mock, type MockProxy } from 'jest-mock-extended';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook';

import { AuthenticationError } from '@/domain/errors/authentication';

type SutTypes = {
	sut: FacebookAuthenticationUseCase;
	loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
};

const makeSut = (): SutTypes => {
	const loadFacebookUserApi = mock<LoadFacebookUserApi>();
	const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);

	return {
		loadFacebookUserApi,
		sut,
	};
};

describe('FacebookAuthenticationUseCase', (): void => {
	it('should call LoadFacebookUserApi with correct input', async (): Promise<void> => {
		const { loadFacebookUserApi, sut } = makeSut();

		await sut.exec({ token: 'fake_random_token' });

		expect(loadFacebookUserApi.exec).toHaveBeenCalledWith({
			token: 'fake_random_token',
		});
		expect(loadFacebookUserApi.exec).toHaveBeenCalledTimes(1);
	});

	it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async (): Promise<void> => {
		const { loadFacebookUserApi, sut } = makeSut();

		loadFacebookUserApi.exec.mockResolvedValueOnce(undefined);

		const authOutput: AuthenticationError = await sut.exec({
			token: 'fake_random_token',
		});

		expect(authOutput).toEqual(new AuthenticationError());
	});
});
