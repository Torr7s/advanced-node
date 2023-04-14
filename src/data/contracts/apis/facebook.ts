export namespace LoadFacebookUserApi {
	export type Input = {
		token: string;
	};

	export type Output =
		| undefined
		| {
				facebookId: string;
				name: string;
				email: string;
		  };
}

export interface LoadFacebookUserApi {
	exec: (
		input: LoadFacebookUserApi.Input,
	) => Promise<LoadFacebookUserApi.Output>;
}
