import { FacebookAPI } from '@infra/apis';
import { AxiosHttpClient } from '@infra/http';

import { env } from '@main/config/env';

describe('Facebook Api Integration Tests', (): void => {
	it('should return a Facebook User if token is valid', async (): Promise<void> => {
		const axiosClient = new AxiosHttpClient();

		const sut = new FacebookAPI(
			axiosClient,
			env.facebookApi.clientId,
			env.facebookApi.clientSecret,
		);

		/**
		 * The expiration time of this token is in 3 months from now, so that is the reason for not
		 * running this test together with the unit tests
		 */
		const fbUser = await sut.loadUser({
			token: env.facebookApi.test.userAccessToken,
		});

		expect(fbUser).toEqual({
			facebookId: env.facebookApi.test.userId,
			name: env.facebookApi.test.userName,
			email: env.facebookApi.test.userEmail,
		});
	});

	it('should return undefined if token is invalid', async (): Promise<void> => {
		const axiosClient = new AxiosHttpClient();

		const sut = new FacebookAPI(
			axiosClient,
			env.facebookApi.clientId,
			env.facebookApi.clientSecret,
		);

		const fbUser = await sut.loadUser({ token: 'invalid_token' });

		expect(fbUser).toBeUndefined();
	});
});
