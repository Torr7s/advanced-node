import {
	RequiredStringValidator,
	type Validator,
} from '@/application/validation';

export class ValidationBuilder {
	private constructor(
		private readonly fieldName: string,
		private readonly value: string,
		private readonly validators: Validator[] = [],
	) {}

	public static of(params: {
		fieldName: string;
		value: string;
	}): ValidationBuilder {
		return new ValidationBuilder(params.fieldName, params.value);
	}

	public required(): ValidationBuilder {
		this.validators.push(
			new RequiredStringValidator(this.fieldName, this.value),
		);

		return this;
	}

	public build(): Validator[] {
		return this.validators;
	}
}

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
