export class ServerHttpError extends Error {
	constructor(error?: Error) {
		super('Server internal error. Try again soon.');

		this.name = this.constructor.name;

		this.stack = error?.stack;
	}
}
