import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { BookRequests } from './bookRequests.js';
import { Books } from '../books/books.js';

Meteor.methods({
    'bookRequests.create'(toUserId, bookId, status, priority){
        const fromUserId = Meteor.userId();
        const book = Books.findOne({_id: bookId, owner: toUserId});
        const status = 'requested' //status can be 'requested', 'accepted'
        const priority = BookRequests.findOne({toUserId, bookId}, {sort: {priority: -1}})['priority'] + 1; //request priority is 1 higher than previous highest (last on waiting line)
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
    'bookRequests.accept'(fromUserId, bookId) {
        BookRequests.update({fromUserId, bookId, toUserId: Meteor.userId()}, {$set: {status: 'accepted'}});
    },
    'bookRequests.delete'(fromUserId, toUserId, bookId) {
        if (fromUserId === Meteor.userId() || toUserId === Meteor.userId()) {
            const requestToRemove = BookRequests.findOne({fromUserId, toUserId, bookId});
            const currentPriority = requestToRemove.priority;
            BookRequests.remove(requestToRemove);
            BookRequests.update({toUserId, bookId, priority: {$gt: currentPriority}}, {$inc: {priority: -1}}); //upgrades the priority of all lower-priority requests
        }
    }
});