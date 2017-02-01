import { Books } from '../../books/books.js';
import { check } from 'meteor/check';

SearchSource.defineSource('searchResults', function (searchText, options) {
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
    query["$and"].push({ profileOnly: { $exists: false } });
    const results = Books.find(query, { limit: 24, skip: 24 * pageNumber });

    return {
        data: results.fetch(),
        metadata: {
            total: Books.find(query).count(),
            page: pageNumber
        }
    };
});

function buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function (word) {
        return "(?=.*" + word + ")";
    });
    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
}
