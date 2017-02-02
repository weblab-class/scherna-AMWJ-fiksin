import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Books } from './books.js';
import { Shelves } from '../shelves/shelves.js';
import { BookRequests } from '../bookRequests/bookRequests.js';

Meteor.methods({
    'books.create'(shelfId, title, author, isbn, pageCount, summary, bookUrl, imageUrl, profileOnly) {
        const shelf = Shelves.findOne({ _id: shelfId, owner: Meteor.userId() });
        var bookObject = {
            title,
            author,
            isbn,
            pageCount,
            summary,
            bookUrl,
            imageUrl,
            profileOnly,
            private: false,
            createdAt: new Date(),
            owner: Meteor.userId()
        }
        if (shelf) {
            bookObject.shelf = shelf._id;
        }
        if (Meteor.user().location) {
            bookObject.location = Meteor.user().location;
        }
        else {
            bookObject.location = { Latitude: 42.349259, Longitude: -71.078711 };
        }
        return Books.insert(bookObject);
    },
    'books.delete'(id) {
        check(id, String);
        const book = Books.findOne(id);
        if (book.owner == Meteor.userId()) {
            Books.remove({ _id: id });
            BookRequests.remove({bookId: id});
        }
    }
});
