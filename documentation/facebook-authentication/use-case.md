# Facebook Authentication

> ## Data
* Access Token

> ## First Flow
1. ✅ Get data (name, email, facebookId) from Facebook API
2. ✅ Check if there is a user with the above received email address
3. ✅ Create an account for the user with the data received from Facebook
4. ✅ Create an access token, from the user ID, that expires within 30 minutes
5. ✅ Return the generated access token

> ## Alternative flow: User already exists
3. ✅ Update the user account with the received Facebook data (Facebook ID and name - only update the name if the user account has no name)

> ## Exception flow: Invalid or expired token
1. ✅ Return an authentication error