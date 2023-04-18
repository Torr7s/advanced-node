import { RequiredFieldError } from '../errors';

export class RequiredStringValidator {
	constructor(
		private readonly fieldName: string,
		private readonly value: string,
	) {}

	public validate(): Error | undefined {
		if (!this.value) {
			return new RequiredFieldError(this.fieldName);
		}
	}
}
