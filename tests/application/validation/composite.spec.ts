import { type MockProxy, mock } from 'jest-mock-extended';

export interface Validator {
	validate: () => Error | undefined;
}

export class ValidationComposite {
	constructor(private readonly validators: Validator[]) {}

	public validate(): undefined {
		return undefined;
	}
}

describe('ValidationComposite', (): void => {
	it('should return undefined if all Validators return undefined', (): void => {
		const validator1: MockProxy<Validator> = mock();
		const validator2: MockProxy<Validator> = mock();

		validator1.validate.mockReturnValue(undefined);
		validator2.validate.mockReturnValue(undefined);

		const validators: Validator[] = [validator1, validator2];

		const sut = new ValidationComposite(validators);

		const error = sut.validate();

		expect(error).toBeUndefined();
	});
});
