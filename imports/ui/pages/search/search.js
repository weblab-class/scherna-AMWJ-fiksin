import { Books } from '/imports/api/books/books.js';
import { BookRequests } from '/imports/api/bookRequests/bookRequests.js';
import './search.html';
import './search.css'

var options = {
    localSearch: true
};
var fields = ['packageName', 'description'];

PackageSearch = new SearchSource('searchResults', fields, options);

Template.search.onCreated(function () {
    Meteor.subscribe('books.public');
    Meteor.subscribe('bookRequests.fromYou');
    Meteor.subscribe('books.yours');
    Meteor.subscribe('userData');
    PackageSearch.search($("#q").val() || "", {page: 0});
});

Template.search.helpers({
    searchResults() {
        const results = PackageSearch.getData({
        });
        const rowedResults = [];
        for (i = 0; i < results.length; i += 4) {
            rowedResults.push(results.slice(i, i + 4));
        }
        return rowedResults;
    },
    title() {
        return this.title;
    },
    author() {
        return this.author;
    },
    profileUrl(userId) {
        return FlowRouter.path("App.profile", { _id: userId });
    },
    alreadyRequested() {
        return BookRequests.find({ bookId: this._id, fromUserId: Meteor.userId() }).count() > 0;
    }
});

Template.search.events({
    'click .col-item'(event) {
        const username = Meteor.users.findOne(this.owner).username;
        const pathToLibrary = FlowRouter.path("App.library", {_id: this.owner});
        const alreadyRequested = BookRequests.find({ bookId: this._id, fromUserId: Meteor.userId() }).count() > 0;
        bootbox.alert({message: "<div id='dialogNode'></div>", backdrop:true});
        Blaze.renderWithData(Template.bookModal, this, $("#dialogNode")[0]);
    },
    'click .requestBookButton'(event) {
        Meteor.call('bookRequests.create', this.owner, this._id);
    },
    'click .deleteRequestButton'(event) {
        const bookRequestId = BookRequests.findOne({ bookId: this._id, fromUserId: Meteor.userId() })._id;
        Meteor.call('bookRequests.delete', bookRequestId);
    }
});