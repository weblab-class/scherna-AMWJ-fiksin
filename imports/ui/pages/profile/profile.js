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
        return Shelves.find();
    },
    booksOnShelf() {
        return Books.find({ shelf: this._id });
    },
    unsortedBooks() {
        return Books.find({ shelf: { $exists: false } });
    }
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