import { Books } from '/imports/api/books/books.js';
import { BookRequests } from '/imports/api/bookRequests/bookRequests.js';
import './search.html';
import './search.css'

var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
};
var fields = ['packageName', 'description'];

PackageSearch = new SearchSource('searchResults', fields, options);

Template.search.onCreated(function () {
    Meteor.subscribe('books.public');
    Meteor.subscribe('bookRequests.fromYou');

    PackageSearch.search($("#q").val());
});

Template.search.helpers({
    searchResults() {
        return PackageSearch.getData({
            transform: function (matchText, regExp) {
                return matchText.replace(regExp, "<b>$&</b>")
            },
            //sort: { isoScore: -1 }
        });
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
    'click .panel-heading span.clickable'(event) {
        var $this = $(event.target);
        if (!$this.hasClass('panel-collapsed')) {
            $this.parents('.panel').find('.panel-body').slideUp();
            $this.addClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
        } else {
            $this.parents('.panel').find('.panel-body').slideDown();
            $this.removeClass('panel-collapsed');
            $this.find('i').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        }
    },
    'click .requestBookButton'(event) {
        Meteor.call('bookRequests.create', this.owner, this._id);
    },
    'click .deleteRequestButton'(event) {
        const bookRequestId = BookRequests.findOne({ bookId: this._id, fromUserId: Meteor.userId() })._id;
        Meteor.call('bookRequests.delete', bookRequestId);
    }
});