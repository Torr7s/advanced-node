import { mock, type MockProxy } from 'jest-mock-extended';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type LoadUserAccountRepository,
	type SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { FacebookAuthenticationUseCase } from '@/data/use-cases/facebook';

import { AuthenticationError } from '@/domain/errors';
import { FacebookAccount } from '@/domain/models';

jest.mock('@/domain/models/facebook-account');

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

	it('should call SaveFacebookAccountRepository with FacebookAccount', async (): Promise<void> => {
		const FacebookAccountStub: jest.Mock = jest
			.fn()
			.mockImplementation((): object => ({
				any: 'any',
			}));

		jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

		await sut.exec({ token });

		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
			any: 'any',
		});
		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
	});
});
