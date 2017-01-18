// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Books } from '../books.js';

Meteor.publish('books.public', function () {
    return Books.find({ private: false });
});

Meteor.publish('books.yours', function () {
    return Books.find({ owner: this.userId });
});