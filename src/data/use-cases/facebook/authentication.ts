import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type LoadUserAccountRepository,
	type SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors';
import { type FacebookAuthentication } from '@/domain/features';
import { FacebookAccount } from '@/domain/models';

export class FacebookAuthenticationUseCase {
	constructor(
		private readonly facebookApi: LoadFacebookUserApi,
		private readonly userAccountRepository: LoadUserAccountRepository &
			SaveFacebookAccountRepository,
	) {}

	public async exec(
		input: FacebookAuthentication.Input,
	): Promise<AuthenticationError> {
		const facebookData: LoadFacebookUserApi.Output =
			await this.facebookApi.loadUser(input);

		if (facebookData != null) {
			const accountData: LoadUserAccountRepository.Output =
				await this.userAccountRepository.findOne({
					email: facebookData.email,
				});

			const facebookAccount = new FacebookAccount(facebookData, accountData);

			await this.userAccountRepository.saveWithFacebook(facebookAccount);
		}

		return new AuthenticationError();
	}
}
