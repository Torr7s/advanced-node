import { Controller } from '@/application/controllers';
import { ServerHttpError } from '@/application/errors';
import { type HttpResponse } from '@/application/helpers';
import { ValidationComposite } from '@/application/validation';

jest.mock('@/application/validation/composite');

class ControllerStub extends Controller {
	public result: HttpResponse = {
		statusCode: 200,
		data: 'any_data',
	};

	public async perform(httpRequest: any): Promise<HttpResponse> {
		return this.result;
	}
}

describe('Controller', (): void => {
	let sut: ControllerStub;

	beforeEach((): void => {
		sut = new ControllerStub();
	});

	it('should return 400 if validation fails', async (): Promise<void> => {
		const error = new Error('validation_error');

		const ValidationCompositeSpy: jest.Mock = jest
			.fn()
			.mockImplementationOnce((): object => ({
				validate: jest.fn().mockReturnValueOnce(error),
			}));

		jest
			.mocked(ValidationComposite)
			.mockImplementationOnce(ValidationCompositeSpy);

		const httpResponse = await sut.handle('any_value');

		expect(httpResponse).toEqual({
			statusCode: 400,
			data: error,
		});
		expect(ValidationComposite).toHaveBeenCalledWith([]);
	});

	it('should return 500 if perform throws', async (): Promise<void> => {
		const error = new Error('perform_error');

		jest.spyOn(sut, 'perform').mockRejectedValueOnce(error);

		const httpResponse = await sut.handle('any_value');

		expect(httpResponse).toEqual({
			statusCode: 500,
			data: new ServerHttpError(error),
		});
	});

	it('should return same result as perform', async (): Promise<void> => {
		const httpResponse = await sut.handle('any_value');

		expect(httpResponse).toEqual(sut.result);
	});
});
