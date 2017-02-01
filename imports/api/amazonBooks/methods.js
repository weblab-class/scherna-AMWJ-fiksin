import { Meteor } from 'meteor/meteor';

Meteor.methods({
    'amazonAPI.getBookByTitle'(bookTitle, bookAuthor) {
        var client = AmazonProductApi.createClient({
            awsId: Meteor.settings.AMAZON_ID,
            awsSecret: Meteor.settings.AMAZON_SECRET,
            awsTag: Meteor.settings.AMAZON_TAG
        });
        var items = client.itemSearchSync({
            title: bookTitle,
            author: bookAuthor,
            searchIndex: 'Books',
            sort: 'relevancerank',
            responseGroup: 'ItemAttributes,Images,EditorialReview'
        });
        return items.slice(0,3);
    },
    'amazonAPI.getBookByISBN'(isbn) {
        var client = AmazonProductApi.createClient({
            awsId: Meteor.settings.AMAZON_ID,
            awsSecret: Meteor.settings.AMAZON_SECRET,
            awsTag: Meteor.settings.AMAZON_TAG
        });
        var items = client.itemLookupSync({
            idType: 'ISBN',
            itemId: isbn,
            searchIndex: 'Books',
            sort: 'relevancerank',
            responseGroup: 'ItemAttributes,Images,EditorialReview'
        });
        return items[0];
    }
});