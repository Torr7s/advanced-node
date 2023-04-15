import { type HttpGetClient } from '@/infra/http';

import { type LoadFacebookUserApi } from '@/data/contracts/apis';

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
