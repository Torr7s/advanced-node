import { makeFacebookAuthenticationUseCase } from '../services';

import { FacebookLoginController } from '@app/controllers';

export const makeFacebookLoginController = (): FacebookLoginController => {
	return new FacebookLoginController(makeFacebookAuthenticationUseCase());
};
