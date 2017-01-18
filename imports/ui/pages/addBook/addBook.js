import { Books } from '/imports/api/books/books.js';
import { Shelves } from '/imports/api/shelves/shelves.js';
import './addBook.html';

Template.addBook.onCreated(function() {
    Meteor.subscribe('shelves.all');
    Meteor.subscribe('books.yours');
})

Template.addBook.helpers({
    shelves() {
        return Shelves.find({ owner: Meteor.userId() });
    },
});

Template.addBook.events({
    'submit #addBookByTitle'(event) {
        event.preventDefault();
        const shelfId = $("#shelfInput").val() || undefined;
        const target = event.target;
        const title = target.title;
        const author = target.author;

        Meteor.call('books.create.bytitle', title.value, author.value, shelfId, function () {
            title.value = "";
            author.value = "";
        });
    }
})