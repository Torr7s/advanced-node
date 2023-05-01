import { type MockProxy, mock } from 'jest-mock-extended';

import { FacebookLoginController } from '@app/controllers';
import { UnauthorizedError } from '@app/errors';
import { RequiredStringValidator } from '@app/validation';

import { AuthenticationError } from '@domain/errors';
import { type FacebookAuthentication } from '@domain/features';
import { AccessToken } from '@domain/models';

describe('FacebookLoginController', (): void => {
	let facebookAuth: MockProxy<FacebookAuthentication>;
	let sut: FacebookLoginController;

	const token = 'any_token';

	beforeAll((): void => {
		facebookAuth = mock();

		facebookAuth.exec.mockResolvedValue(new AccessToken('any_value'));
	});

	beforeEach((): void => {
		sut = new FacebookLoginController(facebookAuth);
	});

	it('should build Validators correctly', async (): Promise<void> => {
		const validators = sut.buildValidators({
			token,
		});

		expect(validators).toEqual([
			new RequiredStringValidator('token', 'any_token'),
		]);
	});

	it('should call FacebookAuthenticationUseCase with correct input', async (): Promise<void> => {
		await sut.handle({
			token,
		});

		expect(facebookAuth.exec).toHaveBeenCalledWith({
			token: 'any_token',
		});
		expect(facebookAuth.exec).toHaveBeenCalledTimes(1);
	});

	it('should return 401 if authentication fails', async (): Promise<void> => {
		facebookAuth.exec.mockResolvedValueOnce(new AuthenticationError());

		const httpResponse = await sut.handle({
			token,
		});

		expect(httpResponse).toEqual({
			statusCode: 401,
			data: new UnauthorizedError(),
		});
	});

	it('should return 200 if authentication succeeds', async (): Promise<void> => {
		const httpResponse = await sut.handle({
			token,
		});

		expect(httpResponse).toEqual({
			statusCode: 200,
			data: {
				accessToken: 'any_value',
			},
		});
	});
});
