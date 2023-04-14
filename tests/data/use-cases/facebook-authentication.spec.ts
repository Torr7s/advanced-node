import { mock, type MockProxy } from 'jest-mock-extended';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type CreateFacebookAccountRepository,
	type LoadUserAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook';

import { AuthenticationError } from '@/domain/errors/authentication';

describe('FacebookAuthenticationUseCase', (): void => {
	let loadFacebookUserApi: MockProxy<LoadFacebookUserApi>;
	let loadUserAccountRepository: MockProxy<LoadUserAccountRepository>;
	let createFacebookAccountRepository: MockProxy<CreateFacebookAccountRepository>;

	let sut: FacebookAuthenticationUseCase;

	const token: string = 'fake_random_token';

	beforeEach((): void => {
		loadFacebookUserApi = mock();
		loadUserAccountRepository = mock();
		createFacebookAccountRepository = mock();

		loadFacebookUserApi.exec.mockResolvedValue({
			facebookId: 'random_facebook_id',
			name: 'random_facebook_username',
			email: 'random_facebook_email',
		});

		sut = new FacebookAuthenticationUseCase(
			loadFacebookUserApi,
			loadUserAccountRepository,
			createFacebookAccountRepository,
		);
	});

	it('should call LoadFacebookUserApi with correct input', async (): Promise<void> => {
		await sut.exec({ token: 'fake_random_token' });

		expect(loadFacebookUserApi.exec).toHaveBeenCalledWith({ token });
		expect(loadFacebookUserApi.exec).toHaveBeenCalledTimes(1);
	});

	it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async (): Promise<void> => {
		loadFacebookUserApi.exec.mockResolvedValueOnce(undefined);

		const authOutput: AuthenticationError = await sut.exec({ token });

		expect(authOutput).toEqual(new AuthenticationError());
	});

	it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async (): Promise<void> => {
		await sut.exec({ token });

		expect(loadUserAccountRepository.findOne).toHaveBeenCalledWith({
			email: 'random_facebook_email',
		});
		expect(loadUserAccountRepository.findOne).toHaveBeenCalledTimes(1);
	});

	it('should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async (): Promise<void> => {
		loadUserAccountRepository.findOne.mockResolvedValueOnce(undefined);

		await sut.exec({ token });

		expect(
			createFacebookAccountRepository.createFromFacebook,
		).toHaveBeenCalledWith({
			facebookId: 'random_facebook_id',
			name: 'random_facebook_username',
			email: 'random_facebook_email',
		});
		expect(
			createFacebookAccountRepository.createFromFacebook,
		).toHaveBeenCalledTimes(1);
	});
});
