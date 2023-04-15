import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import { type TokenGenerator } from '@/data/contracts/crypto';
import {
	type LoadUserAccountRepository,
	type SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors';
import { type FacebookAuthentication } from '@/domain/features';
import { AccessToken, FacebookAccount } from '@/domain/models';

export class FacebookAuthenticationUseCase {
	constructor(
		private readonly facebookApi: LoadFacebookUserApi,
		private readonly userAccountRepository: LoadUserAccountRepository &
			SaveFacebookAccountRepository,
		private readonly crypto: TokenGenerator,
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

			const { id } = await this.userAccountRepository.saveWithFacebook(
				facebookAccount,
			);

			await this.crypto.generateToken({
				key: id,
				expirationInMs: AccessToken.expirationInMs,
			});
		}

		return new AuthenticationError();
	}
}
