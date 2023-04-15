import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import { mock } from 'jest-mock-extended';

export interface HttpGetClient {
	get: (input: HttpGetClient.Input) => Promise<void>;
}

export namespace HttpGetClient {
	export type Input = {
		url: string;
	};
}

export class FacebookAPI {
	private static readonly baseURL: string = 'https://graph.facebook.com';

	constructor(private readonly httpClient: HttpGetClient) {}

	public async findOne(input: LoadFacebookUserApi.Input): Promise<void> {
		await this.httpClient.get({
			url: `${FacebookAPI.baseURL}/oauth/access_token`,
		});
	}
}

describe('Facebook API', (): void => {
	it('should get app token', async (): Promise<void> => {
		const httpClient = mock<HttpGetClient>();
		const sut = new FacebookAPI(httpClient);

		await sut.findOne({ token: 'any_client_token' });

		expect(httpClient.get).toHaveBeenCalledWith({
			url: 'https://graph.facebook.com/oauth/access_token',
		});
	});
});
