import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { BookRequests } from './bookRequests.js';
import { Books } from '../books/books.js';

Meteor.methods({
    'bookRequests.create'(toUserId, bookId){
        const fromUserId = Meteor.userId();
        const book = Books.findOne({_id: bookId, owner: toUserId});
        const status = 'requested' //status can be 'requested', 'accepted'
        const lastRequestOnBook = BookRequests.findOne({ toUserId, bookId }, { sort: { priority: -1 } });
        var priority = 0;
        if (lastRequestOnBook) {
            priority = lastRequestOnBook['priority'] + 1; //request priority is 1 higher than previous highest (last on waiting line)
        }
        if (book) {
            BookRequests.insert({
                fromUserId,
                toUserId,
                bookId,
                status,
                priority
            });
        }
    },
    'bookRequests.accept'(bookRequestId) {
        BookRequests.update(bookRequestId, {$set: {status: 'accepted'}});
    },
    'bookRequests.delete'(bookRequestId) {
        const requestToRemove = BookRequests.findOne(bookRequestId);
        if (requestToRemove.fromUserId === Meteor.userId() || requestToRemove.toUserId === Meteor.userId()) {
            const currentPriority = requestToRemove.priority;
            const bookId = requestToRemove.bookId;
            BookRequests.remove(requestToRemove);
            BookRequests.update({bookId, priority: {$gt: currentPriority}}, {$inc: {priority: -1}}); //upgrades the priority of all lower-priority requests
        }
    },
    'bookRequests.lended'(bookRequestId) {
        BookRequests.update(bookRequestId, { $set: { status: 'lended' } });
    },
});