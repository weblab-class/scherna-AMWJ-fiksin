import { BookRequests } from '/imports/api/bookRequests/bookRequests.js';
import { Books } from '/imports/api/books/books.js';
import { Meteor } from 'meteor/meteor';
import './requests.html';

Template.requests.onCreated(function () {
    Meteor.subscribe('bookRequests.fromYou');
    Meteor.subscribe('bookRequests.toYou');
});

Template.requests.helpers({
    requestsFromYou() {
        return BookRequests.find({ fromUserId: this.userId });
    },
    requestsToYou() {
        return BookRequests.find({ toUserId: this.userId });
    }
});

Template.requests.events({
    'click .acceptRequest'(event) {

        const target = event.target;
        const shelfName = target.shelfName;
 
        event.preventDefault();

        Meteor.call('shelves.create', shelfName.value, function (error) {

            if (!error) {
                shelfName.value = "";
            }
        });
    },
    'click .deleteRequest'(event) {

        const target = event.target;
        const shelfName = target.shelfName;

        event.preventDefault();

        Meteor.call('shelves.create', shelfName.value, function (error) {

            if (!error) {
                shelfName.value = "";
            }
        });
    }
})