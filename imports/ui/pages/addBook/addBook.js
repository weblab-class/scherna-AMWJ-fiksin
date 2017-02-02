import { Books } from '/imports/api/books/books.js';
import { Shelves } from '/imports/api/shelves/shelves.js';
import './addBook.html';

Template.addBook.onCreated(function() {
    Meteor.subscribe('shelves.all');
    Meteor.subscribe('books.yours');
    this.autorun(function () {
        Template.instance().shelf = Shelves.findOne({ _id: FlowRouter.getParam("_id"), owner: Meteor.userId()});
    });
});

Template.addBook.helpers({
    shelfIsMine() {
        return Shelves.findOne({ _id: FlowRouter.getParam("_id"), owner: Meteor.userId()});
    }
});

Template.addBook.events({
    'submit #addBookByTitle'(event) {
        event.preventDefault();
        const shelfId = Template.instance().shelf._id;
        const isProfileOnly = Shelves.findOne(shelfId).profileOnly || false;
        const target = event.target;
        const title = target.title.value;
        const author = target.author.value;

        Meteor.call('amazonAPI.getBookByTitle', title, author, function (err, res) {
            if (err) {
                bootbox.alert("We could not find a book matching your specifications. Try using the ISBN!");
            }
            else {
                try {
                    var modalHTML = `<table class="table"><form>`
                    var results = {};
                    res.forEach(function (result, index) {
                        try {
                            const itemAttributes = result.ItemAttributes[0];
                            const bookUrl = result.DetailPageURL[0];
                            let summary = 'No summary found';
                            if (result.EditorialReviews) {
                                summary = result.EditorialReviews[0].EditorialReview[0].Content[0];
                            }
                            const imgUrl = result.LargeImage[0].URL[0];
                            const bookTitle = itemAttributes.Title[0];
                            let bookAuthor = 'Author Unknown';
                            if (itemAttributes.Author) {
                                bookAuthor = itemAttributes.Author[0];
                            }
                            const isbn = itemAttributes.ISBN[0];
                            let pageCount = 'Unknown';
                            if (itemAttributes.NumberOfPages) {
                                pageCount = itemAttributes.NumberOfPages[0];
                            } 
                            var optionHTML = `<tr class="">
                                                <td>
                                                    <input type="radio" name="option" value=${index}>
                                                </td>
                                                <td>
                                                    <div class="row"><a href="${bookUrl}">${bookTitle}</a></div>
                                                    <div class="row">by ${bookAuthor}</div>
                                                    <div class="row">ISBN: ${isbn}</div>
                                                </td>
                                            </tr>`
                            modalHTML += optionHTML;
                            results[index] = {itemAttributes, bookUrl, summary, imgUrl, bookTitle, bookAuthor, isbn, pageCount};
                        } catch (err) {}
                    });
                    if (! $.isEmptyObject(results)) {
                        modalHTML += `</form></table>`;
                        let modal = bootbox.confirm({
                            title: "Which book did you mean?",  
                            message: modalHTML, 
                            callback: function(result) {
                                if (result) {
                                    const index = $('input[name=option]:checked').val() || 0;
                                    const correctBook = results[index]
                                    Meteor.call('books.create', shelfId, correctBook.bookTitle, correctBook.bookAuthor, correctBook.isbn, correctBook.pageCount, correctBook.summary, correctBook.bookUrl, correctBook.imgUrl, isProfileOnly, function () {
                                    });
                                    target.title.value = '';
                                    target.author.value = '';
                                }
                            }
                        });
                        modal.init(function () {
                            $("input[name=option]:first").prop("checked", true);
                        });
                        }
                    else {
                        throw "Error";
                    }
                }
                catch(err) {
                    bootbox.alert("We could not find a book matching your specifications. Try using the ISBN!");
                    console.log(err);
                    console.log(res);
                }
            }
        });
    },
    'submit #addBookByISBN'(event) {
        event.preventDefault();
        const shelfId = Template.instance().shelf._id;
        const isProfileOnly = Shelves.findOne(shelfId).profileOnly || false;
        const target = event.target;
        const isbn = target.isbn.value.replace('-', '');
        Meteor.call('amazonAPI.getBookByISBN', isbn, function (err, res) {
            if (err) {
                bootbox.alert("We could not find a book matching your specifications. Try using the ISBN!");
            }
            else {
                try {
                    var modalHTML = `<table class="table"><form>`
                    var results = {};
                    res.forEach(function (result, index) {
                        try {
                            const itemAttributes = result.ItemAttributes[0];
                            const bookUrl = result.DetailPageURL[0];
                            let summary = 'No summary found';
                            if (result.EditorialReviews) {
                                summary = result.EditorialReviews[0].EditorialReview[0].Content[0];
                            }
                            const imgUrl = result.LargeImage[0].URL[0];
                            const bookTitle = itemAttributes.Title[0];
                            let bookAuthor = 'Author Unknown';
                            if (itemAttributes.Author) {
                                bookAuthor = itemAttributes.Author[0];
                            }
                            const isbn = itemAttributes.ISBN[0];
                            let pageCount = 'Unknown';
                            if (itemAttributes.NumberOfPages) {
                                pageCount = itemAttributes.NumberOfPages[0];
                            }
                            var optionHTML = `<tr class="">
                                                <td>
                                                    <input type="radio" name="option" value=${index}>
                                                </td>
                                                <td>
                                                    <div class="row"><a href="${bookUrl}">${bookTitle}</a></div>
                                                    <div class="row">by ${bookAuthor}</div>
                                                    <div class="row">ISBN: ${isbn}</div>
                                                </td>
                                            </tr>`
                            modalHTML += optionHTML;
                            results[index] = {itemAttributes, bookUrl, summary, imgUrl, bookTitle, bookAuthor, isbn, pageCount};
                        } catch (err) {}
                    });
                    modalHTML += `</form></table>`;
                    let modal = bootbox.confirm({
                        title: "Which book did you mean?",  
                        message: modalHTML, 
                        callback: function(result) {
                            if (result) {
                                const index = $('input[name=option]:checked').val() || 0;
                                const correctBook = results[index]
                                Meteor.call('books.create', shelfId, correctBook.bookTitle, correctBook.bookAuthor, correctBook.isbn, correctBook.pageCount, correctBook.summary, correctBook.bookUrl, correctBook.imgUrl, isProfileOnly, function () {
                                });
                                target.isbn.value = '';
                            }
                        }
                    });
                    modal.init(function () {
                            $("input[name=option]:first").prop("checked", true);
                        });
                }
                catch(err) {
                    bootbox.alert("We could not find a book matching your specifications. Try using the ISBN!");
                    console.log(err);
                    console.log(res);
                }
            }
        });
    }
});