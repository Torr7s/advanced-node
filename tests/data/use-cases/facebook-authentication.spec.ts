import { type FacebookAuthentication } from '@/domain/features';

interface LoadFacebookUserApi {
	exec: (input: LoadFacebookUserApi.Input) => Promise<void>;
}

export class LoadFacebookUserApiSpy implements LoadFacebookUserApi {
	public token?: string;

	public async exec(input: LoadFacebookUserApi.Input): Promise<void> {
		this.token = input.token;
	}
}

export namespace LoadFacebookUserApi {
	export type Input = {
		token: string;
	};
}

class FacebookAuthenticationUseCase {
	constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

	public async exec(input: FacebookAuthentication.Input): Promise<void> {
		await this.loadFacebookUserApi.exec(input);
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
});
