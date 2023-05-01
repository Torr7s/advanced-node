import { RequiredStringValidator, type Validator } from '@app/validation';

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
