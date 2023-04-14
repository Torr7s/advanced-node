export interface LoadUserAccountRepository {
	findOne: (
		input: LoadUserAccountRepository.Input,
	) => Promise<LoadUserAccountRepository.Output>;
}

export namespace LoadUserAccountRepository {
	export type Input = {
		email: string;
	};

	export type Output =
		| undefined
		| {
				id: string;
				name?: string;
		  };
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

export interface UpdateFacebookAccountRepository {
	updateWithFacebook: (
		input: UpdateFacebookAccountRepository.Input,
	) => Promise<void>;
}

export namespace UpdateFacebookAccountRepository {
	export type Input = {
		id: string;
		facebookId: string;
		name: string;
	};
}
