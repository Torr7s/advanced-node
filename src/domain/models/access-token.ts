export class AccessToken {
	constructor(private readonly value: string) {}

	public static readonly expirationInMs = 1_800_000;
}
