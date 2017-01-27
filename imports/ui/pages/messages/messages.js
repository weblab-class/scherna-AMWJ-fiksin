import { Meteor } from 'meteor/meteor';

import './messages.html';

Template.messages.onCreated(function() {

});

Template.messages.helpers({
    
});

Template.messages.events({
    'click .conversation'(event) {
        FlowRouter.go("App.conversation", {_id: this._id});
    }
});