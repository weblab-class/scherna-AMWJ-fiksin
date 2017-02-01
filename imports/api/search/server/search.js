﻿import { Books } from '../../books/books.js';
import { check } from 'meteor/check';

SearchSource.defineSource('searchResults', function (searchText, options) {
    console.log(options.page);
    const pageNumber = options.page || 0;
    check(searchText, String);
    var substrings = searchText.split(" ");
    fields = ["title", "author", "genre"];
    query = {
        $and: substrings.map(function (searchTerm) {
            return {
                $or: fields.map(function (field) {
                    var obj = {};
                    obj[field] = { $regex: searchTerm, $options: 'i' };
                    return obj;
                })
            };
        })
    };
    query["$and"].push({ owner: { $ne: Meteor.userId() } });
    return Books.find(query, {limit: 20, skip: 20 * pageNumber }).fetch();
});

function buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function (word) {
        return "(?=.*" + word + ")";
    });
    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
}
