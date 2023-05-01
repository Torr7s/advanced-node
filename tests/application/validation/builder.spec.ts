import { RequiredStringValidator, ValidationBuilder } from '@app/validation';

describe('ValidationBuilder', (): void => {
	it('should return a RequiredStringValidator', (): void => {
		const validators = ValidationBuilder.of({
			fieldName: 'any_field_name',
			value: 'any_value',
		})
			.required()
			.build();

		expect(validators).toEqual([
			new RequiredStringValidator('any_field_name', 'any_value'),
		]);
	});
});
