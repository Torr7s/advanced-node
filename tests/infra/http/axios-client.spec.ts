import axios, { type AxiosStatic } from 'axios';

import { type HttpGetClient } from '@/infra/http';

jest.mock('axios');

class AxiosHttpClient {
	public async get({ params, url }: HttpGetClient.Input): Promise<any> {
		const result = await axios.get(url, {
			params,
		});

		return result.data;
	}
}

describe('AxiosHttpClient', (): void => {
	let sut: AxiosHttpClient;
	let mockedAxios: jest.Mocked<AxiosStatic>;

	let url: string;
	let params: object;

	beforeAll((): void => {
		mockedAxios = axios as jest.Mocked<typeof axios>;

		url = 'any_url';
		params = {
			any: 'any',
		};

		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: 'any_data',
		});
	});

	beforeEach((): void => {
		sut = new AxiosHttpClient();
	});

	describe('X GET', (): void => {
		it('should call get with correct input', async (): Promise<void> => {
			await sut.get({ url, params });

			expect(mockedAxios.get).toHaveBeenCalledWith(url, {
				params,
			});
			expect(mockedAxios.get).toHaveBeenCalledTimes(1);
		});

		it('should return on success', async (): Promise<void> => {
			const result = await sut.get({
				url,
				params,
			});

			expect(result).toEqual('any_data');
		});

		it('should rethrow if axios.get throws', async (): Promise<void> => {
			mockedAxios.get.mockRejectedValueOnce(new Error('axios_http_error'));

			const promise = sut.get({
				url,
				params,
			});

			await expect(promise).rejects.toThrow(new Error('axios_http_error'));
		});
	});

	// describe('X POST', (): void => {
	//   it('', (): void => {
	//
	//   });
	// });
});
