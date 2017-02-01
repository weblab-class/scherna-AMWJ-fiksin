import { Books } from '/imports/api/books/books.js';
import { BookRequests } from '/imports/api/bookRequests/bookRequests.js';
import { Shelves } from '/imports/api/shelves/shelves.js';
import { Meteor } from 'meteor/meteor';
//import { ReactiveVar } from 'reactivevar';
import './library.html';
import './library.css';

import '../../components/bookModal/bookModal.js';

Template.library.onCreated(function () {
    Meteor.subscribe('shelves.all');
    Meteor.subscribe('books.yours');
    Meteor.subscribe('books.public');
    Meteor.subscribe('userData');

    currentBookId = new ReactiveVar(null);
    firstBook = Books.findOne({owner:FlowRouter.getParam("_id")})
    if (firstBook) {
        currentBookId.set(firstBook._id);
    }
});

Template.library.helpers({
    userExists() {
        return Meteor.users.findOne(FlowRouter.getParam("_id"));
    },
    isMyAccount() {
        return Meteor.userId() && Meteor.userId() == FlowRouter.getParam("_id");
    },
    shelves() {
        return Shelves.find({ owner: FlowRouter.getParam("_id") });
    },
    booksOnShelf() {
        return Books.find({ owner: FlowRouter.getParam("_id"), shelf: this._id });
    },
    unsortedBooks() {
        return Books.find({ owner: FlowRouter.getParam("_id"), shelf: { $exists: false } });
    },
    pathForLibrary() {
        return FlowRouter.path("App.library", {_id: FlowRouter.getParam("_id") });
    },
    pathForProfile() {
        return FlowRouter.path("App.profile", {_id: FlowRouter.getParam("_id") });
    },
    pathForRequests() {
        return FlowRouter.path("App.requests");
    },
    pathForAddBook() {
        return FlowRouter.path("App.addBook", {_id: this._id});
    },
    showPreview() {
        return currentBookId.get() != null;
    },
    currentBook() {
        return Books.findOne(currentBookId.get());
    },
    alreadyRequested() {
        return BookRequests.find({ bookId: currentBookId.get(), fromUserId: Meteor.userId() }).count() > 0;
    },
});

Template.library.events({
    'submit .newShelf'(event) {

        const target = event.target;
        const shelfName = target.shelfName;

        event.preventDefault();

        Meteor.call('shelves.create', shelfName.value, function (error) {

            if (!error) {
                shelfName.value = "";
            }
        });
    },
    'click .deleteShelfButton'(event) {
        Meteor.call('shelves.delete', this._id);
    },
    'mouseenter .bookTitle'(event) {
        currentBookId.set(this._id);
    },
    'click .bookTitle'(event) {
        bootbox.alert({message: "<div id='dialogNode'></div>", backdrop:true});
        Blaze.renderWithData(Template.bookModal, this, $("#dialogNode")[0]);
    },
    'click .closeButton'(event) {
        currentBookId.set(null);
    },
    'click .deleteBook'(event) {
        Meteor.call('books.delete', this._id);
        currentBookId.set(null);
    },
    'click .request'(event) {
        var currentBook = Books.findOne(currentBookId.get());
        Meteor.call('bookRequests.create', currentBook.owner, currentBook._id);
    },
    'click .deleteRequest'(event) {
        var currentBook = Books.findOne(currentBookId.get());
        const bookRequestId = BookRequests.findOne({ bookId: currentBook._id, fromUserId: Meteor.userId() })._id;
        Meteor.call('bookRequests.delete', bookRequestId);
    }
});