import { Meteor } from 'meteor/meteor';

Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find({},
            { fields: { 'requestWeeks': 1, 'latitude': 1, 'longitude': 1 } });
    } else {
        this.ready();
    }
});
