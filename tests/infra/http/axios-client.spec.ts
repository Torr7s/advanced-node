import axios from 'axios';

import { type HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
	public async get({ params, url }: HttpGetClient.Input): Promise<void> {
		await axios.get(url, {
			params,
		});
	}
}

describe('AxiosHttpClient', (): void => {
	describe('X GET', (): void => {
		it('should call get with correct input', async (): Promise<void> => {
			const mockedAxios = axios as jest.Mocked<typeof axios>;
			const sut = new AxiosHttpClient();

			await sut.get({
				url: 'any_url',
				params: {
					any: 'any',
				},
			});

			expect(mockedAxios.get).toHaveBeenCalledWith('any_url', {
				params: {
					any: 'any',
				},
			});

			expect(mockedAxios.get).toHaveBeenCalledTimes(1);
		});
	});

	// describe('X POST', (): void => {
	//   it('should', (): void => {

	//   });
	// });
});
