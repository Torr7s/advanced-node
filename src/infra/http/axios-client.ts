import axios from 'axios';

import { type HttpGetClient } from './client';

export class AxiosHttpClient implements HttpGetClient {
	public async get<T = any>({ params, url }: HttpGetClient.Input): Promise<T> {
		const result = await axios.get(url, {
			params,
		});

		return result.data;
	}
}
