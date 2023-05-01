import { type HttpResponse, badRequest, serverError } from '@app/helpers';
import { ValidationComposite, type Validator } from '@app/validation';

export abstract class Controller {
	public abstract perform(httpRequest: any): Promise<HttpResponse>;

	public buildValidators(httpRequest: any): Validator[] {
		return [];
	}

	public async handle(httpRequest: any): Promise<HttpResponse> {
		const error = this.validate(httpRequest);

		if (error) {
			return badRequest(error);
		}

		try {
			return await this.perform(httpRequest);
		} catch (error) {
			return serverError(error as Error);
		}
	}

	private validate(httpRequest: any): Error | undefined {
		const validators: Validator[] = this.buildValidators(httpRequest);

		return new ValidationComposite(validators).validate();
	}
}
