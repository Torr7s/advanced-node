import { type MockProxy, mock } from 'jest-mock-extended';

import { type FacebookAuthentication } from '@/domain/features';
import { AuthenticationError } from '@/domain/errors';
import { AccessToken } from '@/domain/models';

type HttpResponse = {
	statusCode: number;
	data: any;
};

export class FacebookLoginController {
	constructor(
		private readonly facebookAuthentication: FacebookAuthentication,
	) {}

	public async handle(httpRequest: any): Promise<HttpResponse> {
		try {
			if (!httpRequest.token) {
				return {
					statusCode: 400,
					data: new Error('The field token is required'),
				};
			}

			const result = await this.facebookAuthentication.exec({
				token: httpRequest.token,
			});

			if (result instanceof AccessToken) {
				return {
					statusCode: 200,
					data: {
						accessToken: result.value,
					},
				};
			} else {
				return {
					statusCode: 401,
					data: result,
				};
			}
		} catch (error) {
			return {
				statusCode: 500,
				data: new ServerError(error as Error),
			};
		}
	}
}

export class ServerError extends Error {
	constructor(error?: Error) {
		super('Server internal error. Try again soon.');

		this.name = this.constructor.name;

		this.stack = error?.stack;
	}
}

describe('FacebookLoginController', (): void => {
	let facebookAuth: MockProxy<FacebookAuthentication>;
	let sut: FacebookLoginController;

	beforeAll((): void => {
		facebookAuth = mock();

		facebookAuth.exec.mockResolvedValue(new AccessToken('any_value'));
	});

	beforeEach((): void => {
		sut = new FacebookLoginController(facebookAuth);
	});

	it('should return 400 if token is empty', async (): Promise<void> => {
		const httpResponse = await sut.handle({ token: '' });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should return 400 if token is null', async (): Promise<void> => {
		const httpResponse = await sut.handle({ token: null });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should return 400 if token is undefined', async (): Promise<void> => {
		const httpResponse = await sut.handle({ token: undefined });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should call FacebookAuthenticationUseCase with correct input', async (): Promise<void> => {
		await sut.handle({ token: 'any_token' });

		expect(facebookAuth.exec).toHaveBeenCalledWith({
			token: 'any_token',
		});
		expect(facebookAuth.exec).toHaveBeenCalledTimes(1);
	});

	it('should return 401 if authentication fails', async (): Promise<void> => {
		facebookAuth.exec.mockResolvedValueOnce(new AuthenticationError());

		const httpResponse = await sut.handle({ token: 'any_token' });

		expect(httpResponse).toEqual({
			statusCode: 401,
			data: new AuthenticationError(),
		});
	});

	it('should return 200 if authentication succeeds', async (): Promise<void> => {
		const httpResponse = await sut.handle({ token: 'any_token' });

		expect(httpResponse).toEqual({
			statusCode: 200,
			data: {
				accessToken: 'any_value',
			},
		});
	});

	it('should return 500 if authentication throws', async (): Promise<void> => {
		const error = new Error('infra_error');

		facebookAuth.exec.mockRejectedValueOnce(new Error('infra_error'));

		const httpResponse = await sut.handle({ token: 'any_token' });

		expect(httpResponse).toEqual({
			statusCode: 500,
			data: new ServerError(error),
		});
	});
});
