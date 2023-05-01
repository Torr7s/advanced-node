import { mock, type MockProxy } from 'jest-mock-extended';

import { type LoadFacebookUserApi } from '@data/contracts/apis';
import { type TokenGenerator } from '@data/contracts/crypto';
import {
	type LoadUserAccountRepository,
	type SaveFacebookAccountRepository,
} from '@data/contracts/repositories';
import { FacebookAuthenticationUseCase } from '@data/use-cases/facebook';

import { AuthenticationError } from '@domain/errors';
import { AccessToken, FacebookAccount } from '@domain/models';

jest.mock('@domain/models/facebook-account');

describe('FacebookAuthenticationUseCase', (): void => {
	let token: string;

	let userAccountRepository: MockProxy<
		LoadUserAccountRepository & SaveFacebookAccountRepository
	>;
	let crypto: MockProxy<TokenGenerator>;
	let facebookApi: MockProxy<LoadFacebookUserApi>;

	let sut: FacebookAuthenticationUseCase;

	beforeAll((): void => {
		token = 'fake_random_token';

		facebookApi = mock();
		userAccountRepository = mock();
		crypto = mock();

		facebookApi.loadUser.mockResolvedValue({
			facebookId: 'any_facebook_id',
			name: 'any_facebook_name',
			email: 'any_facebook_email',
		});

		userAccountRepository.load.mockResolvedValue(undefined);
		userAccountRepository.saveWithFacebook.mockResolvedValue({
			id: 'any_account_id',
		});

		crypto.generateToken.mockResolvedValue('any_generated_token');
	});

	beforeEach((): void => {
		sut = new FacebookAuthenticationUseCase(
			facebookApi,
			userAccountRepository,
			crypto,
		);
	});

	it('should call LoadFacebookUserApi with correct input', async (): Promise<void> => {
		await sut.exec({
			token: 'fake_random_token',
		});

		expect(facebookApi.loadUser).toHaveBeenCalledWith({
			token,
		});
		expect(facebookApi.loadUser).toHaveBeenCalledTimes(1);
	});

	it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async (): Promise<void> => {
		facebookApi.loadUser.mockResolvedValueOnce(undefined);

		const authOutput = await sut.exec({
			token,
		});

		expect(authOutput).toEqual(new AuthenticationError());
	});

	it('should call LoadUserAccountRepository when LoadFacebookUserApi returns data', async (): Promise<void> => {
		await sut.exec({
			token,
		});

		expect(userAccountRepository.load).toHaveBeenCalledWith({
			email: 'any_facebook_email',
		});
		expect(userAccountRepository.load).toHaveBeenCalledTimes(1);
	});

	it('should call SaveFacebookAccountRepository with FacebookAccount', async (): Promise<void> => {
		const FacebookAccountStub: jest.Mock = jest
			.fn()
			.mockImplementation((): object => ({
				any: 'any',
			}));

		jest.mocked(FacebookAccount).mockImplementation(FacebookAccountStub);

		await sut.exec({
			token,
		});

		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledWith({
			any: 'any',
		});
		expect(userAccountRepository.saveWithFacebook).toHaveBeenCalledTimes(1);
	});

	it('should call TokenGenerator with correct input', async (): Promise<void> => {
		await sut.exec({
			token,
		});

		expect(crypto.generateToken).toHaveBeenCalledWith({
			key: 'any_account_id',
			expirationInMs: AccessToken.expirationInMs,
		});
		expect(crypto.generateToken).toHaveBeenCalledTimes(1);
	});

	it('should return an AccessToken on success', async (): Promise<void> => {
		const authResult = await sut.exec({
			token,
		});

		expect(authResult).toEqual(new AccessToken('any_generated_token'));
	});

	it('should rethrow if LoadFacebookUserApi throws', async (): Promise<void> => {
		facebookApi.loadUser.mockRejectedValueOnce(
			new Error('facebook_user_api_error'),
		);

		const promise = sut.exec({
			token,
		});

		await expect(promise).rejects.toThrow(new Error('facebook_user_api_error'));
	});

	it('should rethrow if LoadUserAccountRepository throws', async (): Promise<void> => {
		userAccountRepository.load.mockRejectedValueOnce(
			new Error('load_user_account_error'),
		);

		const promise = sut.exec({
			token,
		});

		await expect(promise).rejects.toThrow(new Error('load_user_account_error'));
	});

	it('should rethrow if SaveFacebookAccountRepository throws', async (): Promise<void> => {
		userAccountRepository.load.mockRejectedValueOnce(
			new Error('save_facebook_account_error'),
		);

		const promise = sut.exec({
			token,
		});

		await expect(promise).rejects.toThrow(
			new Error('save_facebook_account_error'),
		);
	});

	it('should rethrow if TokenGenerator throws', async (): Promise<void> => {
		userAccountRepository.load.mockRejectedValueOnce(
			new Error('token_generator_error'),
		);

		const promise = sut.exec({
			token,
		});

		await expect(promise).rejects.toThrow(new Error('token_generator_error'));
	});
});
