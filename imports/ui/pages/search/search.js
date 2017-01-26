import { Books } from '/imports/api/books/books.js';
import './search.html';
import './search.css'

Template.search.onCreated(function () {
    Meteor.subscribe('books.public');
});

Template.search.helpers({
    searchResults() {
        return Books.find()
    },
    title() {
        return this.title;
    },
    author() {
        return this.author;
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
    }
});