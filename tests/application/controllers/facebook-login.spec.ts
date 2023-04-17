type HttpResponse = {
	statusCode: number;
	data: any;
};

export class FacebookLoginController {
	public async handle(httpRequest: any): Promise<HttpResponse> {
		return {
			statusCode: 400,
			data: new Error('The field token is required'),
		};
	}
}

describe('FacebookLoginController', (): void => {
	it('should return 400 if token is empty', async (): Promise<void> => {
		const sut = new FacebookLoginController();

		const httpResponse = await sut.handle({ token: '' });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should return 400 if token is null', async (): Promise<void> => {
		const sut = new FacebookLoginController();

		const httpResponse = await sut.handle({ token: null });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});

	it('should return 400 if token is undefined', async (): Promise<void> => {
		const sut = new FacebookLoginController();

		const httpResponse = await sut.handle({ token: undefined });

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: new Error('The field token is required'),
		});
	});
});
