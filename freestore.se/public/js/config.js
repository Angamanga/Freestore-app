var app = angular.module('freestore', ['ui.router']);

//configs
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('new', {
            url: '/new',
            templateUrl: '/../views/new.html',
            controller: 'NewThingController',
            controllerAs: 'thingformctrl'
        })
        .state('preview', {
            url: '/preview',
            templateUrl: '/../views/preview.html',
            controller: 'PreviewController',
            controllerAs: 'previewctrl'

        })
        .state('thing', {
            url: '/thing/:thingId',
            controller: 'ThingController',
            controllerAs: 'thingctrl'
        })
        .state('previewEdit', {
            url: '/previewEdit/',
            templateUrl: '/../views/new.html',
            controller: 'EditController',
            controllerAs: 'editctrl'
        })
        .state('thingEdit', {
            url: '/previewEdit/:id',
            controller: 'EditController',
            controllerAs: 'editctrl'
        })

                    }]);