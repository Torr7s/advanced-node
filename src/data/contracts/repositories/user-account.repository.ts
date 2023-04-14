export interface LoadUserAccountRepository {
	findOne: (
		input: LoadUserAccountRepository.Input,
	) => Promise<LoadUserAccountRepository.Output>;
}

export namespace LoadUserAccountRepository {
	export type Input = {
		email: string;
	};

	export type Output = undefined;
}

export interface CreateFacebookAccountRepository {
	createFromFacebook: (
		input: CreateFacebookAccountRepository.Input,
	) => Promise<void>;
}

export namespace CreateFacebookAccountRepository {
	export type Input = {
		facebookId: string;
		name: string;
		email: string;
	};
}
