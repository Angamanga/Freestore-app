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
            templateUrl: '/../views/new.html',
            controller: 'NewThingController',
            controllerAs: 'thingformctrl'
        })
        .state('preview', {
            url: '/preview/',
            templateUrl: '/../views/preview.html',
            controller: 'PreviewController',
            controllerAs: 'previewctrl'

        })
        .state('changePreview', {
            url: '/preview/:id',
            templateUrl: '/../views/preview.html',
            controller: 'ChangePreviewController',
            controllerAs: 'thingctrl'
        })
        .state('thing', {
            url: '/thing/:thingId',
            templateUrl: '/../views/preview.html',
            controller: 'ThingController',
            controllerAs: 'thingctrl'
        })
        .state('previewEdit', {
            url: '/edit/',
            templateUrl: '/../views/new.html',
            controller: 'PreviewEditController',
            controllerAs: 'editctrl'
        })
        .state('thingEdit', {
            url: '/edit/:id',
            templateUrl: '/../views/new.html',
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