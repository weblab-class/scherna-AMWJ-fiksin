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