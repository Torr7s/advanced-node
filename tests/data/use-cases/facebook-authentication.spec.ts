import { mock, type MockProxy } from 'jest-mock-extended';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type LoadUserAccountRepository,
	type SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook';

import { AuthenticationError } from '@/domain/errors/authentication';

describe('FacebookAuthenticationUseCase', (): void => {
	let userAccountRepository: MockProxy<
		LoadUserAccountRepository & SaveFacebookAccountRepository
	>;
	let facebookApi: MockProxy<LoadFacebookUserApi>;

	let sut: FacebookAuthenticationUseCase;

	const token: string = 'fake_random_token';

	beforeEach((): void => {
		facebookApi = mock();
		userAccountRepository = mock();

		facebookApi.loadUser.mockResolvedValue({
			facebookId: 'any_facebook_id',
			name: 'any_facebook_name',
			email: 'any_facebook_email',
		});

		sut = new FacebookAuthenticationUseCase(facebookApi, userAccountRepository);

		userAccountRepository.findOne.mockResolvedValue(undefined);
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
			email: 'any_facebook_email',
		});
		expect(userAccountRepository.findOne).toHaveBeenCalledTimes(1);
	});

	it('should create account with facebook data', async (): Promise<void> => {
		await sut.exec({ token });

		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
			facebookId: 'any_facebook_id',
			name: 'any_facebook_name',
			email: 'any_facebook_email',
		});
		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
	});

	it('should not update account name', async (): Promise<void> => {
		userAccountRepository.findOne.mockResolvedValueOnce({
			id: 'any_id',
			name: 'any_name',
		});

		await sut.exec({ token });

		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
			id: 'any_id',
			facebookId: 'any_facebook_id',
			name: 'any_name',
			email: 'any_facebook_email',
		});
		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
	});

	it('should update account name', async (): Promise<void> => {
		userAccountRepository.findOne.mockResolvedValueOnce({
			id: 'any_id',
		});

		await sut.exec({ token });

		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
			id: 'any_id',
			facebookId: 'any_facebook_id',
			name: 'any_facebook_name',
			email: 'any_facebook_email',
		});
		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
	});
});
