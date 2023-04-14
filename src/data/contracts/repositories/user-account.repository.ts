export interface LoadUserAccountRepository {
	findOne: (input: LoadUserAccountRepository.Input) => Promise<void>;
}

export namespace LoadUserAccountRepository {
	export type Input = {
		email: string;
	};
}
