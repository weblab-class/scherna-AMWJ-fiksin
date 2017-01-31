import { Meteor } from 'meteor/meteor';
import { Books } from '../books/books.js';
import { check } from 'meteor/check';

Meteor.methods({
    'userData.updateRequestWeeks'(requestWeeks) {
        check(requestWeeks, Number);
        return Meteor.users.update(Meteor.userId(), { $set: { requestWeeks } });
    },
    'userData.updateLocation'(longitude, latitude) {
        check(longitude, Number);
        check(latitude, Number);
        var location = {
            location: {
                "Longitude": longitude,
                "Latitude": latitude
            }
        };
        Books.update( {owner: Meteor.userId() }, {$set: location})
        return Meteor.users.update(Meteor.userId(), {
            $set: location
        });
    }
});
