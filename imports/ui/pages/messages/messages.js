import { Meteor } from 'meteor/meteor';

import './messages.html';

Template.messages.onCreated(function() {

});

Template.messages.helpers({
    
});

Template.messages.events({
    'click .conversation'(event) {
        FlowRouter.go("App.conversation", {_id: this._id});
    },
    'submit .newConversation'(event) {
        event.preventDefault();
        const username = event.target.username.value;
        const conversation = new Conversation().save();
        const userToAdd = Meteor.users.findOne({username});
        conversation.addParticipant(userToAdd);
        conversation.sendMessage("Hi " + username);
        event.target.message.value = '';
    }
});