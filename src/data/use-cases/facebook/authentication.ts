import { type LoadFacebookUserApi } from '@/data/contracts/apis';
import {
	type LoadUserAccountRepository,
	type SaveFacebookAccountRepository,
} from '@/data/contracts/repositories';

import { AuthenticationError } from '@/domain/errors/authentication';
import { type FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase {
	constructor(
		private readonly facebookApi: LoadFacebookUserApi,
		private readonly userAccountRepository: LoadUserAccountRepository &
			SaveFacebookAccountRepository,
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

			await this.userAccountRepository.saveWithFacebook({
				id: accountData?.id,
				name: accountData?.name ?? fbData.name,
				email: fbData.email,
				facebookId: fbData.facebookId,
			});
		}

		return new AuthenticationError();
	}
}
