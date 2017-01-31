import { Meteor } from 'meteor/meteor';
import './profile.html';
import './profile.css';

Template.profile.onCreated(function () {
    Meteor.subscribe('userData');
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
            Meteor.call('userData.updateLongitude', Number(position.coords.longitude));
            Meteor.call('userData.updateLatitude', Number(position.coords.latitude));
        });
    }
});