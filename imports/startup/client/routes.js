import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/addBook/addBook.js';
import '../../ui/pages/library/library.js';
import '../../ui/pages/search/search.js'

// Set up all routes in the app
FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { page: 'home' });
    },
});

FlowRouter.route('/library', {
    name: 'App.library',
    action() {
        BlazeLayout.render('App_body', { page: 'library' });
    },
});

FlowRouter.route('/profile', {
    name: 'App.profile',
    action() {
        BlazeLayout.render('App_body', { page: 'profile' });
    },
});

FlowRouter.route('/addBook', {
    name: 'App.addBook',
    action() {
        BlazeLayout.render('App_body', { page: 'addBook' });
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