import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type CreateFacebookAccountRepository,
	type LoadUserAccountRepository,
	type UpdateFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors/authentication';
import { type FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase {
	constructor(
		private readonly facebookApi: LoadFacebookUserApi,
		private readonly userAccountRepository: LoadUserAccountRepository &
			CreateFacebookAccountRepository &
			UpdateFacebookAccountRepository,
	) {}

	public async exec(
		input: FacebookAuthentication.Input,
	): Promise<AuthenticationError> {
		const fbData: LoadFacebookUserApi.Output = await this.facebookApi.loadUser(
			input,
		);

		if (fbData != null) {
			const accountData: LoadUserAccountRepository.Output =
				await this.userAccountRepository.findOne({
					email: fbData.email,
				});

			if (accountData != null) {
				await this.userAccountRepository.updateWithFacebook({
					id: accountData.id,
					name: accountData.name ?? fbData.name,
					facebookId: fbData.facebookId,
				});
			} else {
				await this.userAccountRepository.createFromFacebook(fbData);
			}
		}

		return new AuthenticationError();
	}
}
