export class AuthenticationError extends Error {
	constructor() {
		super('Facebook authentication failed');

		this.name = this.constructor.name;
	}
}
