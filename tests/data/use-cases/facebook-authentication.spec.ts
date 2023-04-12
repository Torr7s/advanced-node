import { type LoadFacebookUserApi } from '@/data/contracts/apis';

import { AuthenticationError } from '@/domain/errors/authentication';
import { type FacebookAuthentication } from '@/domain/features';

export class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
	public token?: string;
	public output = undefined;

	public async exec(
		input: LoadFacebookUserApi.Input,
	): Promise<LoadFacebookUserApi.Output> {
		this.token = input.token;

		return this.output;
	}
}

class FacebookAuthenticationUseCase {
	constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

	public async exec(
		input: FacebookAuthentication.Input,
	): Promise<AuthenticationError> {
		await this.loadFacebookUserApi.exec(input);

		return new AuthenticationError();
	}
}

describe('FacebookAuthenticationUseCase', (): void => {
	it('should call LoadFacebookUserApi with correct input', async (): Promise<void> => {
		const loadFacebookUserApi = new LoadFacebookUserApiSpy();
		const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);

		await sut.exec({
			token: 'fake_random_token',
		});

		expect(loadFacebookUserApi.token).toBe('fake_random_token');
	});

	it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async (): Promise<void> => {
		const loadFacebookUserApi = new LoadFacebookUserApiSpy();
		loadFacebookUserApi.output = undefined;

		const sut = new FacebookAuthenticationUseCase(loadFacebookUserApi);

		const authOutput = await sut.exec({
			token: 'fake_random_token',
		});

		expect(authOutput).toEqual(new AuthenticationError());
	});
});
