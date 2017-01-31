import { Books } from '/imports/api/books/books.js';
import { Meteor } from 'meteor/meteor';
import './body.html';
import '../../pages/loggedOut/loggedOut.js'

Template.App_body.onCreated(function () {
    Meteor.subscribe('books.yours');
})

Template.App_body.helpers({
    isLoggedIn() {
        return Meteor.userId() != null;
    },
    librarySize() {
        return Books.find({ owner: Meteor.userId() }).count();
    },
    pathForHome() {
        return FlowRouter.path("App.home");
    },
    pathForAddBook() {
        return FlowRouter.path("App.addBook");
    },
    pathForSearch() {
        return FlowRouter.path("App.search");
    },
    pathForLibrary() {
        return FlowRouter.path("App.library", { _id: Meteor.userId() });
    },
    pathForProfile() {
        return FlowRouter.path("App.profile", { _id: Meteor.userId() });
    },
    pathForRequests() {
        return FlowRouter.path("App.requests");
    },
    pathForMessages() {
        return FlowRouter.path("App.messages");
    },
});

Template.App_body.events({
    'click .logoutButton'(event, instance) {
        Accounts.logout();
    },
    'submit .searchForm'(event) {
        event.preventDefault();
        if (FlowRouter.getRouteName() == "App.search") {
            PackageSearch.search(event.target.q.value);
        }
        else {
            FlowRouter.go("/search");
        }
    },
    'input #q'(event) {
        if (FlowRouter.getRouteName() == "App.search") {
            PackageSearch.search(event.target.value);
        }
    }
});