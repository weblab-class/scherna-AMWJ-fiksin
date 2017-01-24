import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.methods({
    'userData.updateRequestWeeks'(requestWeeks) {
        check(requestWeeks, Number);
        return Meteor.users.update(Meteor.userId(), { $set: { requestWeeks } });
    },
    'userData.updateLongitude'(longitude) {
        check(longitude, Number);
        return Meteor.users.update(Meteor.userId(), { $set: { longitude } });
    },
    'userData.updateLatitude'(latitude) {
        check(latitude, Number);
        return Meteor.users.update(Meteor.userId(), { $set: { latitude } });
    },
});
