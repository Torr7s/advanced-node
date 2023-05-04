import { makeAxiosHttpClient } from '../http';

import { FacebookAPI } from '@infra/apis';

import { env } from '@main/config/env';

export const makeFacebookAPI = (): FacebookAPI => {
	return new FacebookAPI(
		makeAxiosHttpClient(),
		env.facebookApi.clientId,
		env.facebookApi.clientSecret,
	);
};
