import { type MockProxy, mock } from 'jest-mock-extended';

import { FacebookLoginController } from '@/application/controllers';
import {
	RequiredFieldError,
	ServerHttpError,
	UnauthorizedError,
} from '@/application/errors';

import { AuthenticationError } from '@/domain/errors';
import { type FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

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
			data: new RequiredFieldError('token'),
		});
	});

	it('should return 400 if token is null', async (): Promise<void> => {
		const httpResponse = await sut.handle({ token: null as any });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new RequiredFieldError('token'),
		});
	});

	it('should return 400 if token is undefined', async (): Promise<void> => {
		const httpResponse = await sut.handle({ token: undefined as any });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new RequiredFieldError('token'),
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
			data: new UnauthorizedError(),
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
			data: new ServerHttpError(error),
		});
	});
});
