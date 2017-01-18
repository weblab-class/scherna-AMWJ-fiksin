// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Shelves } from '../shelves.js';

Meteor.publish('shelves.all', function () {
    return Shelves.find({});
});