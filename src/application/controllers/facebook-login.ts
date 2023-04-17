import { badRequest, type HttpResponse } from '@/application/helpers';
import { RequiredFieldError, ServerHttpError } from '@/application/errors';

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

			const result = await this.facebookAuthentication.exec({
				token: httpRequest.token,
			});

			if (result instanceof AccessToken) {
				return {
					statusCode: 200,
					data: {
						accessToken: result.value,
					},
				};
			} else {
				return {
					statusCode: 401,
					data: result,
				};
			}
		} catch (error) {
			return {
				statusCode: 500,
				data: new ServerHttpError(error as Error),
			};
		}
	}
}
