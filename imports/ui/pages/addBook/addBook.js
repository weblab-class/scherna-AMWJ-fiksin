import { Books } from '/imports/api/books/books.js';
import { Shelves } from '/imports/api/shelves/shelves.js';
import './addBook.html';

Template.addBook.onCreated(function() {
    Meteor.subscribe('shelves.all');
    Meteor.subscribe('books.yours');
});

Template.addBook.helpers({
    shelves() {
        return Shelves.find({ owner: Meteor.userId() });
    },
});

Template.addBook.events({
    'submit #addBookByTitle'(event) {
        event.preventDefault();
        const shelfId = $("#shelfInput").val() || undefined;
        const target = event.target;
        const title = target.title.value;
        const author = target.author.value;

        Meteor.call('amazonAPI.getBookByTitle', title, author, function (err, res) {
            if (err) {
                bootbox.alert("We could not find a book matching your specifications. Try using the ISBN!");
            }
            else {
                try {
                    const itemAttributes = res.ItemAttributes[0];
                    const bookUrl = res.DetailPageURL[0];
                    const summary = res.EditorialReviews[0].EditorialReview[0].Content[0];
                    const imgUrl = res.LargeImage[0].URL[0];
                    const bookTitle = itemAttributes.Title[0]
                    const bookAuthor = itemAttributes.Author[0]
                    const isbn = itemAttributes.ISBN[0]
                    const pageCount = itemAttributes.NumberOfPages[0]
                    console.log('Title: ' + bookTitle);
                    console.log('Author: ' + bookAuthor);
                    console.log('ISBN: ' + isbn);
                    console.log('Page Count: ' + pageCount);
                    console.log('Summary: ' + summary);
                    console.log('Book URL: ' + bookUrl);
                    console.log('Image URL: ' + imgUrl);
                    modalHTML = `<div class="container">
                                    <div class="row"><a href="${bookUrl}">${bookTitle}</a></div>
                                    <div class="row">by ${bookAuthor}</div>
                                    <div class="row">ISBN: ${isbn}</div>
                                </div>`
                    bootbox.confirm({
                        title: "Is this the book you meant?",  
                        message: modalHTML, 
                        callback: function(result) {
                            if (result) {
                                Meteor.call('books.create', shelfId, bookTitle, bookAuthor, isbn, pageCount, summary, bookUrl, imgUrl, function () {
                                    
                                });
                            }
                        }
                    });
                }
                catch(err) {
                    bootbox.alert("We could not find a book matching your specifications. Try using the ISBN!");
                }
            }
        });
        target.title.value = '';
        target.author.value = '';
    },
    'submit #addBookByISBN'(event) {
        event.preventDefault();
        const shelfId = $("#shelfInput").val() || undefined;
        const target = event.target;
        const isbn = target.isbn.value;

        Meteor.call('amazonAPI.getBookByISBN', isbn, function (err, res) {
            if (err) {
                bootbox.alert("We could not find a book matching your specifications.");
            }
            else {
                try {
                    const itemAttributes = res.ItemAttributes[0];
                    const bookUrl = res.DetailPageURL[0];
                    const summary = res.EditorialReviews[0].EditorialReview[0].Content[0];
                    const imgUrl = res.LargeImage[0].URL[0];
                    const bookTitle = itemAttributes.Title[0]
                    const bookAuthor = itemAttributes.Author[0]
                    const isbn = itemAttributes.ISBN[0]
                    const pageCount = itemAttributes.NumberOfPages[0]
                    console.log('Title: ' + bookTitle);
                    console.log('Author: ' + bookAuthor);
                    console.log('ISBN: ' + isbn);
                    console.log('Page Count: ' + pageCount);
                    console.log('Summary: ' + summary);
                    console.log('Book URL: ' + bookUrl);
                    console.log('Image URL: ' + imgUrl);
                    modalHTML = `<div class="container">
                                    <div class="row"><a href="${bookUrl}">${bookTitle}</a></div>
                                    <div class="row">by ${bookAuthor}</div>
                                    <div class="row">ISBN: ${isbn}</div>
                                </div>`
                    bootbox.confirm({
                        title: "Is this the book you meant?",  
                        message: modalHTML, 
                        callback: function(result) {
                            if (result) {
                                Meteor.call('books.create', shelfId, bookTitle, bookAuthor, isbn, pageCount, summary, bookUrl, imgUrl, function () {
                                    
                                });
                            }
                        }
                    });
                }
                catch(err) {
                    bootbox.alert("We could not find a book matching your specifications.");
                }
            }
        });
        target.isbn.value = '';
    }
});