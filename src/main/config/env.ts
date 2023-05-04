export const env = {
	app: {
		port: process.env.PORT ?? 8080,
	},
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
	jwt: {
		secretKey: (process.env.JWT_SECRET_KEY as string) ?? 'jwt_secret_key',
	},
};
