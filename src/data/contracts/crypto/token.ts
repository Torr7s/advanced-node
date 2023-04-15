export interface TokenGenerator {
	generateToken: (params: TokenGenerator.Input) => Promise<void>;
}

export namespace TokenGenerator {
	export type Input = {
		key: string;
		expirationInMs: number;
	};
}
