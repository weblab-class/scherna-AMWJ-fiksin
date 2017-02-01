import { Meteor } from 'meteor/meteor';

Meteor.publish("userData", function () {
    if (this.userId) {
        return Meteor.users.find({});
    } else {
        this.ready();
    }
});

Meteor.publish("conversationData", function () {
    if (this.userId) {
        return Meteor.conversations.find({});
    }
    else {
        this.ready();
    }
});

Meteor.publish("messageData", function() {
    if (this.userId) {
        return Meteor.messages.find({});
    }
    else {
        this.ready();
    }
});

Meteor.publish("participantData", function() {
    if (this.userId) {
        return Meteor.participants.find({});
    }
    else {
        this.ready();
    }
});