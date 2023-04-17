import {
	type HttpResponse,
	badRequest,
	ok,
	serverError,
	unauthorized,
} from '@/application/helpers';
import { RequiredFieldError } from '@/application/errors';

import { type FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

export class FacebookLoginController {
	constructor(
		private readonly facebookAuthentication: FacebookAuthentication,
	) {}

	public async handle(httpRequest: any): Promise<HttpResponse> {
		try {
			if (!httpRequest.token) {
				return badRequest(new RequiredFieldError('token'));
			}

			const accessToken = await this.facebookAuthentication.exec({
				token: httpRequest.token,
			});

			if (accessToken instanceof AccessToken) {
				return ok({
					accessToken: accessToken.value,
				});
			} else {
				return unauthorized();
			}
		} catch (error) {
			return serverError(error as Error);
		}
	}
}
