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
        return BookRequests.find({ fromUserId: Meteor.userId() });
    },
    requestsToYou() {
        return BookRequests.find({ toUserId: Meteor.userId(), status:'requested' });
    },
    pathForLibrary() {
        return FlowRouter.path("App.library", { _id: Meteor.userId() });
    },
    pathForProfile() {
        return FlowRouter.path("App.profile", { _id: Meteor.userId() });
    },
    pathForProfileFrom() {
        return FlowRouter.path("App.library", { _id: this.fromUserId });
    },
    pathForProfileTo() {
        return FlowRouter.path("App.library", { _id: this.toUserId });
    },
    pathForRequests() {
        return FlowRouter.path("App.requests");
    },
    requestTitle() {
        return Books.findOne(this.bookId).title;
    },
    requestToUser() {
        return Meteor.users.findOne(this.toUserId).username;
    },
    requestFromUser() {
        return Meteor.users.findOne(this.fromUserId).username;
    },
    requestAccepted() {
        return this.status == "accepted";
    }
});

Template.requests.events({
    'click .acceptRequest'(event) {
        Meteor.call('bookRequests.accept', this._id);
    },
    'click .deleteRequest'(event) {
        Meteor.call('bookRequests.delete', this._id);
    },
})