export namespace LoadFacebookUserApi {
	export type Input = {
		token: string;
	};

	export type Output = undefined;
}

export interface LoadFacebookUserApi {
	exec: (
		input: LoadFacebookUserApi.Input,
	) => Promise<LoadFacebookUserApi.Output>;
}
