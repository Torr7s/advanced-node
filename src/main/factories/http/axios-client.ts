import { AxiosHttpClient } from '@infra/http/client';

export const makeAxiosHttpClient = (): AxiosHttpClient => {
	return new AxiosHttpClient();
};
