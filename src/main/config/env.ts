export const env = {
	facebookApi: {
		clientId: process.env.FACEBOOK_CLIENT_ID as string,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
		test: {
			userAccessToken: process.env.FACEBOOK_USER_TEST_ACCESS_TOKEN as string,
			userId: process.env.FACEBOOK_USER_TEST_ID as string,
			userName: process.env.FACEBOOK_USER_TEST_NAME as string,
			userEmail: process.env.FACEBOOK_USER_TEST_EMAIL as string,
		},
	},
};
