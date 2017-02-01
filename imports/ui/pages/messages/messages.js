import { Meteor } from 'meteor/meteor';

import './messages.html';
import './messages.css';

Template.messages.onCreated(function() {
    Meteor.subscribe('userData');
    Meteor.subscribe('conversationData');
    Meteor.subscribe('messageData');
    Meteor.subscribe('participantData');
});

Template.messages.helpers({
    hasConversations() {
        return Meteor.user().conversations().count() > 0;
    },
    pathToUserProfile() {
        return FlowRouter.path("App.profile", {_id: this.user()._id});
    }
});

Template.messages.events({
    'click .conversation'(event) {
        FlowRouter.go("App.conversation", {_id: this._id});
    },
    'submit .newConversation'(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const userToAdd = Meteor.users.findOne({ username });
        if (userToAdd != null) {
            const conversation = new Conversation().save();
            conversation.addParticipant(userToAdd);
            conversation.sendMessage("Hi " + username);
            event.target.username.value = '';
        }
    },
    'click .deleteConversation'(event) {
        this.removeParticipant();
        this.sendMessage(Meteor.user().username + " has left the conversation");
        event.stopPropagation();
    }
});