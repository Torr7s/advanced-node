import { type FacebookAuthentication } from '@/domain/features';
import { mock } from 'jest-mock-extended';

type HttpResponse = {
	statusCode: number;
	data: any;
};

export class FacebookLoginController {
	constructor(
		private readonly facebookAuthentication: FacebookAuthentication,
	) {}

	public async handle(httpRequest: any): Promise<HttpResponse> {
		await this.facebookAuthentication.exec({
			token: httpRequest.token,
		});

		return {
			statusCode: 400,
			data: new Error('The field token is required'),
		};
	}
}

describe('FacebookLoginController', (): void => {
	it('should return 400 if token is empty', async (): Promise<void> => {
		const facebookAuth = mock<FacebookAuthentication>();
		const sut = new FacebookLoginController(facebookAuth);

		const httpResponse = await sut.handle({ token: '' });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should return 400 if token is null', async (): Promise<void> => {
		const facebookAuth = mock<FacebookAuthentication>();
		const sut = new FacebookLoginController(facebookAuth);

		const httpResponse = await sut.handle({ token: null });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should return 400 if token is undefined', async (): Promise<void> => {
		const facebookAuth = mock<FacebookAuthentication>();
		const sut = new FacebookLoginController(facebookAuth);

		const httpResponse = await sut.handle({ token: undefined });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should call FacebookAuthenticationUseCase with correct input', async (): Promise<void> => {
		const facebookAuth = mock<FacebookAuthentication>();
		const sut = new FacebookLoginController(facebookAuth);

		await sut.handle({ token: 'any_token' });

		expect(facebookAuth.exec).toHaveBeenCalledWith({
			token: 'any_token',
		});
		expect(facebookAuth.exec).toHaveBeenCalledTimes(1);
	});
});
