import { mock, type MockProxy } from 'jest-mock-extended';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type CreateFacebookAccountRepository,
	type LoadUserAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook';

import { AuthenticationError } from '@/domain/errors/authentication';

describe('FacebookAuthenticationUseCase', (): void => {
	let userAccountRepository: MockProxy<
		LoadUserAccountRepository & CreateFacebookAccountRepository
	>;
	let facebookApi: MockProxy<LoadFacebookUserApi>;

	let sut: FacebookAuthenticationUseCase;

	const token: string = 'fake_random_token';

	beforeEach((): void => {
		facebookApi = mock();
		userAccountRepository = mock();

		facebookApi.loadUser.mockResolvedValue({
			facebookId: 'random_facebook_id',
			name: 'random_facebook_username',
			email: 'random_facebook_email',
		});

		sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepository);
	});

	it('should call LoadFacebookUserApi with correct input', async (): Promise<void> => {
		await sut.exec({ token: 'fake_random_token' });

		expect(facebookApi.loadUser).toHaveBeenCalledWith({ token });
		expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
	});

	it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async (): Promise<void> => {
		facebookApi.loadUser.mockResolvedValueOnce(undefined);

		const authOutput: AuthenticationError = await sut.exec({ token });

		expect(authOutput).toEqual(new AuthenticationError());
	});

	it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async (): Promise<void> => {
		await sut.exec({ token });

		expect(userAccountRepository.findOne).toHaveBeenCalledWith({
			email: 'random_facebook_email',
		});
		expect(userAccountRepository.findOne).toHaveBeenCalledTimes(1);
	});

	it('should call CreateFacebookAccountRepository when LoadUserAccountRepository returns undefined', async (): Promise<void> => {
		userAccountRepository.findOne.mockResolvedValueOnce(undefined);

		await sut.exec({ token });

		expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
			facebookId: 'random_facebook_id',
			name: 'random_facebook_username',
			email: 'random_facebook_email',
		});
		expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1);
	});
});
