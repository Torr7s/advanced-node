import {
	type HttpResponse,
	badRequest,
	ok,
	serverError,
	unauthorized,
} from '@/application/helpers';

import {
	ValidationBuilder,
	ValidationComposite,
} from '@/application/validation';

import { type FacebookAuthentication } from '@/domain/features';
import { AccessToken } from '@/domain/models';

type HttpRequest = {
	token: string;
};

type Model =
	| Error
	| {
			accessToken: string;
	  };

export class FacebookLoginController {
	constructor(
		private readonly facebookAuthentication: FacebookAuthentication,
	) {}

	public async handle(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
		try {
			const error = this.validate(httpRequest);

			if (error) {
				return badRequest(error);
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

	private validate(httpRequest: HttpRequest): Error | undefined {
		return new ValidationComposite([
			...ValidationBuilder.of({ fieldName: 'token', value: httpRequest.token })
				.required()
				.build(),
		]).validate();
	}
}
