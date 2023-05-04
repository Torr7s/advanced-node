import { makeFacebookAPI } from '../apis';
import { makeJwtTokenGenerator } from '../crypto';
import { makePgUserAccountRepository } from '../repositories';

import { FacebookAuthenticationUseCase } from '@data/use-cases/facebook';

export const makeFacebookAuthenticationUseCase =
	(): FacebookAuthenticationUseCase => {
		return new FacebookAuthenticationUseCase(
			makeFacebookAPI(),
			makePgUserAccountRepository(),
			makeJwtTokenGenerator(),
		);
	};
