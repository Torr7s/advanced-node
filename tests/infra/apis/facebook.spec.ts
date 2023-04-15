import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import { mock } from 'jest-mock-extended';

export interface HttpGetClient {
	get: (input: HttpGetClient.Input) => Promise<void>;
}

export namespace HttpGetClient {
	export type Input = {
		url: string;
		params: object;
	};
}

export class FacebookAPI {
	private static readonly baseURL: string = 'https://graph.facebook.com';
	private static readonly grantType: string = 'client_credentials';

	constructor(
		private readonly httpClient: HttpGetClient,
		private readonly clientId: string,
		private readonly clientSecret: string,
	) {}

	public async findOne(input: LoadFacebookUserApi.Input): Promise<void> {
		await this.httpClient.get({
			url: `${FacebookAPI.baseURL}/oauth/access_token`,
			params: {
				client_id: this.clientId,
				client_secret: this.clientSecret,
				grant_type: FacebookAPI.grantType,
			},
		});
	}
}

describe('Facebook API', (): void => {
	const clientId = 'any_client_id';
	const clientSecret = 'any_client_secret';

	it('should get app token', async (): Promise<void> => {
		const httpClient = mock<HttpGetClient>();
		const sut = new FacebookAPI(httpClient, clientId, clientSecret);

		await sut.findOne({ token: 'any_client_token' });

		expect(httpClient.get).toHaveBeenCalledWith({
			url: 'https://graph.facebook.com/oauth/access_token',
			params: {
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: 'client_credentials',
			},
		});
	});
});
