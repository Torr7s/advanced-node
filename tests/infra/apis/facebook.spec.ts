import { type MockProxy, mock } from 'jest-mock-extended';

import { type HttpGetClient } from '@/infra/http';
import { FacebookAPI } from '@/infra/apis';

describe('Facebook API', (): void => {
	let clientId: string;
	let clientSecret: string;

	let sut: FacebookAPI;
	let httpClient: MockProxy<HttpGetClient>;

	beforeAll((): void => {
		httpClient = mock();

		clientId = 'any_client_id';
		clientSecret = 'any_client_secret';
	});

	beforeEach((): void => {
		sut = new FacebookAPI(httpClient, clientId, clientSecret);
	});

	it('should get app token', async (): Promise<void> => {
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
