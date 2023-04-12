import { type LoadFacebookUserApi } from '@/data/contracts/apis';

import { AuthenticationError } from '@/domain/errors/authentication';
import { type FacebookAuthentication } from '@/domain/features';

export class FacebookAuthenticationUseCase {
	constructor(private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

	public async exec(
		input: FacebookAuthentication.Input,
	): Promise<AuthenticationError> {
		await this.loadFacebookUserApi.exec(input);

		return new AuthenticationError();
	}
}
