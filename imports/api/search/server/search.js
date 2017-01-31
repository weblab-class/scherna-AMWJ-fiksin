import { Books } from '../../books/books.js';
import { check } from 'meteor/check';

SearchSource.defineSource('searchResults', function (searchText, options) {
    /*var options = { sort: { isoScore: -1 }, limit: 20 };

    if (searchText) {
        var regExp = buildRegExp(searchText);
        var selector = { packageName: regExp, description: regExp };
        return Packages.find(selector, options).fetch();
    } else {
        return Packages.find({}, options).fetch();
    }*/
    check(searchText, String);
    var substrings = searchText.split(" ");
    console.log(substrings);
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
    console.log(JSON.stringify(query));
    return Books.find(query).fetch();
});

function buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function (word) {
        return "(?=.*" + word + ")";
    });
    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
}
