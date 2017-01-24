import { Books } from '/imports/api/books/books.js';
import { Shelves } from '/imports/api/shelves/shelves.js';
import { Meteor } from 'meteor/meteor';
import './library.html';

Template.library.onCreated(function () {
    Meteor.subscribe('shelves.all');
    Meteor.subscribe('books.yours');
    Meteor.subscribe('books.public');
});

Template.library.helpers({
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
    }
})