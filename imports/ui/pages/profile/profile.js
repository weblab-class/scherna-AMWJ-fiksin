import { Meteor } from 'meteor/meteor';
import { Shelves } from '/imports/api/shelves/shelves.js';
import { Books } from '/imports/api/books/books.js';
import './profile.html';
import './profile.css';

Template.profile.onCreated(function () {
    Meteor.subscribe('userData');
    Meteor.subscribe('shelves.all');
});

Template.profile.helpers({
    userExists() {
        return Meteor.users.findOne(FlowRouter.getParam("_id"));
    },
    requestWeeks() {
        if (Meteor.user()) {
            return Meteor.users.findOne(FlowRouter.getParam("_id")).requestWeeks || 3;
        }
        else {
            return 0;
        }
    },
    longitude() {
        if (Meteor.user()) {
            return Meteor.users.findOne(FlowRouter.getParam("_id")).longitude || 0;
        }
        else {
            return 0;
        }
    },
    latitude() {
        if (Meteor.user()) {
            return Meteor.users.findOne(FlowRouter.getParam("_id")).latitude || 0;
        }
        else {
            return 0;
        }
    },
    pathForLibrary() {
        return FlowRouter.path("App.library", { _id: FlowRouter.getParam("_id") });
    },
    pathForProfile() {
        return FlowRouter.path("App.profile", { _id: FlowRouter.getParam("_id") });
    },
    pathForRequests() {
        return FlowRouter.path("App.requests");
    },
    isMyAccount() {
        return Meteor.userId() && Meteor.userId() == FlowRouter.getParam("_id");
    },
    favoriteBooks() {
        const shelf = Shelves.findOne({owner: FlowRouter.getParam("_id"), name: 'Favorite Books'});
        if (shelf) {
            return shelf;
        }
        else {
            Meteor.call('shelves.createForProfile', 'Favorite Books', FlowRouter.getParam("_id"));
            return Shelves.findOne({owner: FlowRouter.getParam("_id"), name: 'Favorite Books'});
        }
    },
    readingList() {
        const shelf = Shelves.findOne({owner: FlowRouter.getParam("_id"), name: 'Reading List'});
        if (shelf) {
            return shelf;
        }
        else {
            Meteor.call('shelves.createForProfile', 'Reading List', FlowRouter.getParam("_id"));
            return Shelves.findOne({owner: FlowRouter.getParam("_id"), name: 'Reading List'});
        }
    },
    recommendations() {
        const shelf = Shelves.findOne({owner: FlowRouter.getParam("_id"), name: 'Recommendations'});
        if (shelf) {
            return shelf;
        }
        else {
            Meteor.call('shelves.createForProfile', 'Recommendations', FlowRouter.getParam("_id"));
            return Shelves.findOne({owner: FlowRouter.getParam("_id"), name: 'Recommendations'});
        }
    },
    booksOnShelf() {
        return Books.find({ owner: FlowRouter.getParam("_id"), shelf: this._id });
    },
    pathForAddBook() {
        return FlowRouter.path("App.addBook", {_id: this._id});
    },
    booksWeShare() {
        const myBooks = Books.find({owner:Meteor.userId()});
        const myIsbns = [];
        myBooks.forEach(function (book) {
            myIsbns.push(book.isbn);
        });
        const sharedBooks = [];
        Books.find({owner: FlowRouter.getParam("_id")}).forEach(function (book) {
            if (myIsbns.includes(book.isbn)) {
                sharedBooks.push(book);
            }
        });
        return sharedBooks;
    }
});

Template.profile.events({
    'submit #requestWeeksForm'(event) {
        const target = event.target;
        const requestWeeks = target.newValue;
        event.preventDefault();
        Meteor.call('userData.updateRequestWeeks', Number(requestWeeks.value));
    },
    'submit #longitudeForm'(event) {
        const target = event.target;
        const longitude = target.newValue;
        event.preventDefault();
        Meteor.call('userData.updateLongitude', Number(longitude.value));
    },
    'submit #latitudeForm'(event) {
        const target = event.target;
        const latitude = target.newValue;
        event.preventDefault();
        Meteor.call('userData.updateLatitude', Number(latitude.value));
    },
    'click .setLocation'(event) {
        navigator.geolocation.getCurrentPosition(function (position) {
            Meteor.call('userData.updateLocation', Number(position.coords.longitude), Number(position.coords.latitude));
        });
    },
    'click .bookTitle'(event) {
        bootbox.alert({message: "<div id='dialogNode'></div>", backdrop:true});
        Blaze.renderWithData(Template.bookModal, this, $("#dialogNode")[0]);
    }
});