import axios from 'axios';

import { type HttpGetClient } from './client';

export class AxiosHttpClient {
	public async get({ params, url }: HttpGetClient.Input): Promise<any> {
		const result = await axios.get(url, {
			params,
		});

		return result.data;
	}
}
