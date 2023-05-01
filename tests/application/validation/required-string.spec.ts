import { RequiredFieldError } from '@app/errors';
import { RequiredStringValidator } from '@app/validation';

describe('RequiredStringValidator', (): void => {
	it('should return RequiredFieldError if value is empty', (): void => {
		const sut = new RequiredStringValidator('any_field', '');

		const error = sut.validate();

		expect(error).toEqual(new RequiredFieldError('any_field'));
	});

	it('should return RequiredFieldError if value is null', (): void => {
		const sut = new RequiredStringValidator('any_field', null as any);

		const error = sut.validate();

		expect(error).toEqual(new RequiredFieldError('any_field'));
	});

	it('should return RequiredFieldError if value is undefined', (): void => {
		const sut = new RequiredStringValidator('any_field', undefined as any);

		const error = sut.validate();

		expect(error).toEqual(new RequiredFieldError('any_field'));
	});

	it('should return undefined if value is not empty', (): void => {
		const sut = new RequiredStringValidator('any_field', 'any_value');

		const error = sut.validate();

		expect(error).toBeUndefined();
	});
});
