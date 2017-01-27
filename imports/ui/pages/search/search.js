import { Books } from '/imports/api/books/books.js';
import { BookRequests } from '/imports/api/bookRequests/bookRequests.js';
import './search.html';
import './search.css'

Template.search.onCreated(function () {
    Meteor.subscribe('books.public');
    Meteor.subscribe('bookRequests.fromYou');
});

Template.search.helpers({
    searchResults() {
        return Books.find({ owner: {$not: Meteor.userId() }})
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
    },
});