export class AccessToken {
	public static readonly expirationInMs = 1_800_000;

	constructor(public readonly value: string) {}
}
