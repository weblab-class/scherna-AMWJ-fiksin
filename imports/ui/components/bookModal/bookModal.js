import { Books } from '/imports/api/books/books.js';
import { Meteor } from 'meteor/meteor';
import { BookRequests } from '/imports/api/bookRequests/bookRequests.js';
import { Shelves } from '/imports/api/shelves/shelves.js';
import './bookModal.html';
import './bookModal.css'

Template.bookModal.onCreated(function () {
    Meteor.subscribe('books.yours');
    Meteor.subscribe('books.public');
    Meteor.subscribe('bookRequests.fromYou');
    Meteor.subscribe('bookRequests.toYou');
    Meteor.subscribe('userData');
});

Template.bookModal.helpers({
    alreadyRequested() {
        return BookRequests.find({ bookId: this._id, fromUserId: Meteor.userId() }).count() > 0;
    },
    pathToUserProfile() {
        return FlowRouter.path("App.profile", {_id: this.owner});
    },
    username() {
        return Meteor.users.findOne(this.owner).username;
    },
    isYours() {
        return Meteor.users.findOne(this.owner).username === Meteor.user().username;
    },
});

Template.bookModal.events({
    'click .requestBookButton'(event) {
        Meteor.call('bookRequests.create', this.owner, this._id);
    },
    'click .deleteRequestButton'(event) {
        const bookRequestId = BookRequests.findOne({ bookId: this._id, fromUserId: Meteor.userId() })._id;
        Meteor.call('bookRequests.delete', bookRequestId);
    },
    'click .deleteBook'(event) {
        Meteor.call('books.delete', this._id);
        $('.modal').modal('hide');
    },
    'click .link'(event) {
        $('.modal').modal('hide');
    }
});

function stripHTML(string){
      s = string.replace(/(<([^>]+)>)/ig, '');
      return s;
}

Template.registerHelper('stripHTML', stripHTML)