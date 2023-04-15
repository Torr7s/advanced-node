export interface HttpGetClient {
	get: (input: HttpGetClient.Input) => Promise<void>;
}

export namespace HttpGetClient {
	export type Input = {
		url: string;
		params: object;
	};
}
