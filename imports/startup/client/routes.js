import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/addBook/addBook.js';
import '../../ui/pages/library/library.js';
import '../../ui/pages/search/search.js';
import '../../ui/pages/profile/profile.js';
import '../../ui/pages/requests/requests.js';
import '../../ui/pages/messages/messages.js';
import '../../ui/pages/conversation/conversation.js';

function verifyLoggedIn(context, redirect) {
    console.log("hi");
    console.log(context);
}

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { page: 'home' });
    },
});

FlowRouter.route('/library/:_id', {
    name: 'App.library',
    action(params) {
        BlazeLayout.render('App_body', { page: 'library' });
    },
});

FlowRouter.route('/profile/:_id', {
    name: 'App.profile',
    action(params) {
        BlazeLayout.render('App_body', { page: 'profile' });
    },
});

FlowRouter.route('/addBook', {
    name: 'App.addBook',
    action() {
        BlazeLayout.render('App_body', { page: 'addBook' });
    },
});

FlowRouter.route('/requests', {
    name: 'App.requests',
    action() {
        BlazeLayout.render('App_body', { page: 'requests' });
    },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { page: 'App_notFound' });
  },

};

FlowRouter.route('/search', {
    name: 'App.search',
    action() {
        BlazeLayout.render('App_body', { page: 'search' });
    },
});

FlowRouter.route('/search', {
    name: 'App.search',
    action(params, queryParams) {
        BlazeLayout.render('App_body', { page: 'search' });
    },
});

FlowRouter.route('/messages', {
    name: 'App.messages',
    action() {
        BlazeLayout.render('App_body', { page: 'messages'});
    }
});

FlowRouter.route('/conversation/:_id', {
    name: 'App.conversation',
    action(params) {
        BlazeLayout.render('App_body', {page: 'conversation'});
    }
});

