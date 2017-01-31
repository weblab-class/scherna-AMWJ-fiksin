import { Books } from '/imports/api/books/books.js';
import { Meteor } from 'meteor/meteor';
import './bookModal.html';
import './bookModal.css'

Template.bookModal.onCreated(function () {
    console.log(this);
});
