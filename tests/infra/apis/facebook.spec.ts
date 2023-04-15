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
		httpClient.get
			.mockResolvedValueOnce({ access_token: 'any_app_token' })
			.mockResolvedValueOnce({
				data: {
					user_id: 'any_user_id',
				},
			});

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

	it('should get debug token', async (): Promise<void> => {
		await sut.findOne({ token: 'any_client_token' });

		expect(httpClient.get).toHaveBeenCalledWith({
			url: 'https://graph.facebook.com/debug_token',
			params: {
				access_token: 'any_app_token',
				input_token: 'any_client_token',
			},
		});
	});

	it('should get user info', async (): Promise<void> => {
		await sut.findOne({ token: 'any_client_token' });

		expect(httpClient.get).toHaveBeenCalledWith({
			url: 'https://graph.facebook.com/any_user_id',
			params: {
				fields: 'id,name,email',
				access_token: 'any_client_token',
			},
		});
	});
});
