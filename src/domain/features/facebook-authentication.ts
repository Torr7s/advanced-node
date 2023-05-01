import { type AuthenticationError } from '@domain/errors/authentication';
import { type AccessToken } from '@domain/models/access-token';

export namespace FacebookAuthentication {
	export type Input = {
		token: string;
	};

	export type Output = AccessToken | AuthenticationError;
}

export interface FacebookAuthentication {
	exec: (
		request: FacebookAuthentication.Input,
	) => Promise<FacebookAuthentication.Output>;
}
