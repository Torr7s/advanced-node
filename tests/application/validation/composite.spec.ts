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
});
