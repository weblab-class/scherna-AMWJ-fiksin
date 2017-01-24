import { Books } from '/imports/api/books/books.js';
import { Meteor } from 'meteor/meteor';
import './bookModal.html';

Template.bookModal.onCreated(function () {
    console.log(this);
});
