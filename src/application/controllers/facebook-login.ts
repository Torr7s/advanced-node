import { Controller } from '@/application/controllers';

import { type HttpResponse, ok, unauthorized } from '@/application/helpers';

import {
	ValidationBuilder as VBuilder,
	type Validator,
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

export class FacebookLoginController extends Controller {
	constructor(private readonly facebookAuthentication: FacebookAuthentication) {
		super();
	}

	public async perform(httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
		const accessToken = await this.facebookAuthentication.exec({
			token: httpRequest.token,
		});

		return accessToken instanceof AccessToken
			? ok({ accessToken: accessToken.value })
			: unauthorized();
	}

	public override buildValidators(httpRequest: HttpRequest): Validator[] {
		return [
			...VBuilder.of({ fieldName: 'token', value: httpRequest.token })
				.required()
				.build(),
		];
	}
}
