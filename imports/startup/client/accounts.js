import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
    requestPermissions: {
        facebook: ['user_likes'],
    },
    passwordSignupFields: 'USERNAME_AND_EMAIL'
});