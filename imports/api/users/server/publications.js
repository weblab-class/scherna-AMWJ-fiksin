import { Meteor } from 'meteor/meteor';

Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find({});
    } else {
        this.ready();
    }
});
