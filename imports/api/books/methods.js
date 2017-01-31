import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Books } from './books.js';
import { Shelves } from '../shelves/shelves.js';

Meteor.methods({
    'books.create.byisbn'(isbn) {
        check(isbn, String);

        return Books.insert({
            isbn,
            private: false,
            createdAt: new Date(),
            owner: Meteor.userId()
        });
    },
    'books.create.bytitle'(title, author, shelfId) {
        check(title, String);
        check(author, String);
        const shelf = Shelves.findOne({ _id: shelfId, owner: Meteor.userId() });
        var bookObject = {
            title,
            author,
            private: false,
            createdAt: new Date(),
            owner: Meteor.userId()
        }
        if (shelf) {
            bookObject.shelf = shelf._id;
        }
        return Books.insert(bookObject);
    },
    'books.delete'(id) {
        check(id, String);
        const book = Books.findOne(id);
        if (book.owner == Meteor.userId()) {
            Books.remove({ _id: id });
        }
    }
});
