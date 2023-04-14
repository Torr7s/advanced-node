import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type CreateFacebookAccountRepository,
	type LoadUserAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors/authentication';
import { type FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase {
	constructor(
		private readonly facebookApi: LoadFacebookUserApi,
		private readonly userAccountRepository: LoadUserAccountRepository &
			CreateFacebookAccountRepository,
	) {}

	public async exec(
		input: FacebookAuthentication.Input,
	): Promise<AuthenticationError> {
		const fbData = await this.facebookApi.loadUser(input);

		if (fbData != null) {
			await this.userAccountRepository.findOne({
				email: fbData.email,
			});

			await this.userAccountRepository.createFromFacebook(fbData);
		}

		return new AuthenticationError();
	}
}
