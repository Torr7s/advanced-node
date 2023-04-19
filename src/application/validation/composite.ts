import { type Validator } from './validator';

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
