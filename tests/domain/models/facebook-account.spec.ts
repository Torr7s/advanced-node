import { FacebookAccount } from '@domain/models';

describe('FacebookAccount Model', (): void => {
	const facebookData = {
		name: 'any_facebook_name',
		email: 'any_facebook_email',
		facebookId: 'any_facebook_id',
	};

	it('should create account with facebook data only', (): void => {
		const sut = new FacebookAccount(facebookData);

		expect(sut).toEqual({
			name: 'any_facebook_name',
			email: 'any_facebook_email',
			facebookId: 'any_facebook_id',
		});
	});

	it('should update name if its empty', (): void => {
		const accountData = {
			id: 'any_id',
		};

		const sut = new FacebookAccount(facebookData, accountData);

		expect(sut).toEqual({
			id: 'any_id',
			name: 'any_facebook_name',
			email: 'any_facebook_email',
			facebookId: 'any_facebook_id',
		});
	});

	it('should not update name if its not empty', (): void => {
		const accountData = {
			id: 'any_id',
			name: 'any_name',
		};

		const sut = new FacebookAccount(facebookData, accountData);

		expect(sut).toEqual({
			id: 'any_id',
			name: 'any_name',
			email: 'any_facebook_email',
			facebookId: 'any_facebook_id',
		});
	});
});
