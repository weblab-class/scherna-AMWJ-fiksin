import { Meteor } from 'meteor/meteor';
import { BookRequests} from '../bookRequests.js';

Meteor.publish('bookRequests.fromYou', function () {
    return BookRequests.find({fromUserId: this.userId});
});

Meteor.publish('bookRequests.toYou', function () {
    return BookRequests.find({toUserId: this.userId});
});

Meteor.publish('bookRequests.holdsOnBook', function(bookId) {
    return BookRequests.find({ bookId }, { fields: { fromUserId: 0 } });
});