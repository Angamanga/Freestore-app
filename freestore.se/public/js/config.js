var app = angular.module('freestore', ['ui.router']);

//configs
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/../views/front.html',
            controller: 'HomeController'
        })
        .state('new', {
            url: '/new',
            templateUrl: '/../views/thingForm.html',
            controller: 'NewThingController',
            controllerAs: 'thingformctrl'
        })
        .state('preview', {
            url: '/preview/',
            templateUrl: '/../views/thingView.html',
            controller: 'PreviewController',
            controllerAs: 'previewctrl'

        })
        .state('changePreview', {
            url: '/preview/:id',
            templateUrl: '/../views/thingView.html',
            controller: 'ChangePreviewController',
            controllerAs: 'thingctrl'
        })
        .state('thing', {
            url: '/thing/:thingId',
            templateUrl: '/../views/thingView.html',
            controller: 'ThingController',
            controllerAs: 'thingctrl'
        })
        .state('previewEdit', {
            url: '/edit/',
            templateUrl: '/../views/thingForm.html',
            controller: 'PreviewEditController',
            controllerAs: 'editctrl'
        })
        .state('thingEdit', {
            url: '/edit/:id',
            templateUrl: '/../views/thingForm.html',
            controller: 'ThingController',
            controllerAs: 'editctrl'
        })
        .state('browse', {
            url: '/browse',
            templateUrl: '/../views/browse.html',
            controller: 'BrowseController',
            controllerAs: 'browsectrl'
        })


                }]);