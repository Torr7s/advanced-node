import { type MockProxy, mock } from 'jest-mock-extended';

export interface Validator {
	validate: () => Error | undefined;
}

export class ValidationComposite implements Validator {
	constructor(private readonly validators: Validator[]) {}

	public validate(): Error | undefined {
		for (const validator of this.validators) {
			const error = validator.validate();

			if (error) {
				return error;
			}
		}
	}
}

describe('ValidationComposite', (): void => {
	let sut: ValidationComposite;

	let validator1: MockProxy<Validator>;
	let validator2: MockProxy<Validator>;
	let validators: Validator[] = [];

	beforeAll((): void => {
		validator1 = mock();
		validator2 = mock();

		validator1.validate.mockReturnValue(undefined);
		validator2.validate.mockReturnValue(undefined);

		validators = [validator1, validator2];
	});

	beforeEach((): void => {
		sut = new ValidationComposite(validators);
	});

	it('should return undefined if all Validators return undefined', (): void => {
		const error = sut.validate();

		expect(error).toBeUndefined();
	});

	it('should return the first error', (): void => {
		validator1.validate.mockReturnValue(new Error('first_error'));
		validator2.validate.mockReturnValue(new Error('second_error'));

		const error = sut.validate();

		expect(error).toEqual(new Error('first_error'));
	});
});
