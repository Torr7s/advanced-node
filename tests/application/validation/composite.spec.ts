import { type MockProxy, mock } from 'jest-mock-extended';

import { type Validator, ValidationComposite } from '@app/validation';

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
		validator1.validate.mockReturnValueOnce(new Error('first_error'));
		validator2.validate.mockReturnValueOnce(new Error('second_error'));

		const error = sut.validate();

		expect(error).toEqual(new Error('first_error'));
	});

	it('should return the error', (): void => {
		validator2.validate.mockReturnValue(new Error('second_error'));

		const error = sut.validate();

		expect(error).toEqual(new Error('second_error'));
	});
});
