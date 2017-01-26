import { Meteor } from 'meteor/meteor';

import './conversation.html';

Template.conversation.onCreated(function() {
    this.autorun(function() {
        Template.instance().currentConversation = Meteor.conversations.findOne({_id: FlowRouter.getParam("_id")});
    });
});

Template.conversation.helpers({
    currentConversation() {
        return Template.instance().currentConversation;
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