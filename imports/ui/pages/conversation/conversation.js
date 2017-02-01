import { Meteor } from 'meteor/meteor';

import './conversation.html';
import './conversation.css';

Template.conversation.onCreated(function() {
    this.autorun(function() {
        Template.instance().currentConversation = Meteor.conversations.findOne({_id: FlowRouter.getParam("_id")});
    });
});

Template.conversation.helpers({
    currentConversation() {
        return Template.instance().currentConversation;
    },
    isYou() {
        return this.user().username === Meteor.user().username;
    },
    pathToUserProfile() {
        return FlowRouter.path("App.profile", {_id: this.user()._id});
    }
});

Template.conversation.events({
    'submit .newMessage'(event) {
        event.preventDefault();
        const message = event.target.message.value;
        Template.instance().currentConversation.sendMessage(message);
        event.target.message.value = '';
    }
});