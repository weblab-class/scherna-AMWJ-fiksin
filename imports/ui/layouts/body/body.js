import './body.html';

Template.App_body.helpers({
    librarySize() {
        return 0;
    },
    pathForAddBook() {
        return FlowRouter.path("App.addBook");
    },
    pathForLibrary() {
        return FlowRouter.path("App.library");
    },
    pathForSearch() {
        return FlowRouter.path("App.search");
    }
});

Template.App_body.events({
    'click .logoutButton'(event, instance) {
        Accounts.logout();
    },
});