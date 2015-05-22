var app = angular.module('freestore', ['ui.router', 'ngCookies']);

//configs
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
    //startsida
        .state('home', {
            url: '/',
            templateUrl: '/../views/front.html',
            controller: 'mainController',
            controllerAs: 'collection'
        })
        //registrera en ny sak
        .state('new', {
            url: '/new',
            templateUrl: '/../views/new.html',
            controller: 'NewThingController',
            controllerAs: 'new'
        })
        //forhandsgranska den nya saken (forsta gangen)
        .state('preview', {
            url: '/forhandsgranska',
            templateUrl: '/../views/preview.html',
            controller: 'PreviewController',
            controllerAs: 'prevctrl'
        })
        //editera ny sak efter forhandsgranskning
        .state('previewEdit', {
            url: '/previewEdit',
            templateUrl: '/../views/previewEdit.html',
            controller: 'PrevEditController',
            controllerAs: 'prevedit'
        })
        //editera en sak som redan finns
        .state('edit', {
            url: '/edit/:id',
            templateUrl: '/../views/edit.html',
            controller: 'EditController',
            controllerAs: 'editctrl'
        })
        //forhandsgranska andringar pa en sak som redan finns
        .state('previewAuthEdit', {
            url: '/previewAuthEdit/:id',
            templateUrl: '/../views/previewAuth.html',
            controller: 'prevAuthController',
            controllerAs: 'prevauthctrl'
        })
        //sida for en sparad sak
        .state('thing', {
            url: '/sak/:id',
            templateUrl: '/../views/thing.html',
            controller: 'ThingController',
            controllerAs: 'thingctrl'
        })
        //loginsida
        .state('login', {
            url: '/login/:id',
            templateUrl: '/../views/thingauth.html',
            controller: 'ThingController',
            controllerAs: 'thingctrl'
        })
}]);

//factories
app.factory('newThingfactory', function () {
    console.log('inside newthingfactory');
    var newThing = {
        title: '',
        category: '',
        contact: {
            telephone: '',
            email: ''
        },
        description: '',
        photopath: '',
        thumbnailpath: '',
        time: '',
        location: ''
    };
    return newThing;

});

app.factory('newThingservice',['newThingfactory','$location',function(newThingfactory,$location){

console.log('inside newTHingservice');
    
    var setNewThing = function(prefix,thumbUrl,imgUrl,nextPath){
     newThingfactory.title = prefix.title;
    newThingfactory.category = prefix.category;
     newThingfactory.contact.telephone = prefix.contact.telephone;
     newThingfactory.contact.email = prefix.contact.email;
     newThingfactory.description = prefix.description;
     newThingfactory.photopath = imgUrl
     newThingfactory.thumbnailpath = thumbUrl;
     newThingfactory.time = Date.now();
     newThingfactory.location = prefix.location;
     $location.path(nextPath);
    
    }
return setNewThing;


}]);

//Förstasidan           
app.controller('mainController', ['$scope', '$http', function ($scope, $http) {
    console.log('inside maincontroller');

    $scope.resultHeading = 'Senast tillagda sakerna';
    $scope.collection = this;
    $scope.collection.things = [];
    $scope.collection.searchText = $scope.searchText;

    $http.get('/latest').success(function (data) {
        $scope.collection.things = data;
    })

    $scope.search = function () {
        console.log('inside search');
        $scope.resultHeading = 'Sökresultat';
        var posting = $http({
            method: 'post',
            url: '/search',
            data: {
                'searchText': $scope.collection.searchText
            },
            processData: false
        });
        posting.success(function (response) {
            $scope.collection.things = response
        });
    };
  }]);


app.controller('NewThingController', ['$scope', '$location', 'newThingfactory', 'newThingservice',function ($scope, $location, newThingfactory, newThingservice) {
    console.log('inside NewThingController');

    var thumbUrl, imgUrl, testimg;
    $scope.newThing = this;
    $scope.cloud = function () {
        console.log('inside cloud');
        cloudinary.openUploadWidget({
                cloud_name: 'angamanga',
                upload_preset: 'errmgao1',
                multiple: false,
                theme: 'minimal'
            },
            function (error, result) {
                thumbUrl = result[0].thumbnail_url;
                imgUrl = result[0].url;
                testimg = document.querySelector('#thumbnailimg');
                testimg.src = thumbUrl;
            }
        )
    }
    
    $scope.uploadFile = function(){newThingservice($scope.newThing,thumbUrl,imgUrl,'/forhandsgranska');
                                  };


}]);

//Controller for Preview
app.controller('PreviewController', ['$scope', '$http', '$location', '$rootScope', 'newThingfactory', function ($scope, $http, $location, $rootScope, newThingfactory) {
    console.log('inside PreviewController');
    $scope.preview = this;
    $scope.preview.newThing = newThingfactory;
 

    $scope.Save = function () {
        console.log('inside Save');
        var posting = $http({
            method: 'post',
            url: '/spara',
            data: $scope.preview.newThing,
            processData: false
        });
        posting.success(function (response) {
            $location.path('/sak/' + response);
        });
    }
}]);


//TODO, fixa edit
app.controller('PrevEditController',['$scope', 'newThingfactory', '$location','newThingservice', function ($scope, newThingfactory, $location, newThingservice) {
    console.log('inside PrevEditController');
    $scope.thingToEdit = newThingfactory;
    setSelectedIndex('category', $scope.thingToEdit.category);

    $scope.cloud = function () {
        cloudinary.openUploadWidget({
                cloud_name: 'angamanga',
                upload_preset: 'errmgao1',
                multiple: false,
                theme: 'minimal'
            },
            function (error, result) {
                $scope.thingToEdit.thumbnailpath = result[0].thumbnail_url;
                $scope.thingToEdit.photopath = result[0].url;
                var testimg = document.querySelector('#thumbnailimg');
                testimg.src = $scope.thingToEdit.thumbnailpath;
            }
        )
    }

    function setSelectedIndex(listID, selectedValue) {
        console.log('inside setSelectedIndex');
        var category = document.getElementById(listID);
        for (var i = 0; i < category.options.length; i++) {
            if (category.options[i].value === selectedValue) {
                category.options[i].selected = true;
                break;
            }
        }
    }

    $scope.sendToPreview = function () {newThingservice($scope.thingToEdit,$scope.thingToEdit.thumbnailpath,$scope.thingToEdit.photopath,'/forhandsgranska')};

}]);


//Controller för sak-sida
app.controller('ThingController', function ($scope, $location, $http) {
    console.log('inside Thingcontroller');
    $scope.thing = this;
    $scope.thing.requested = {};
    $scope.id = $location.absUrl().split('/')[5];
    $http.get('/sak/' + $scope.id).success(function (data) {
        $scope.thing.requested = data;
    });

    $scope.delete = function (event) {
        console.log('inside delete');
        event.preventDefault();
        if (confirm('Är du säker på att du vill ta bort din annons?')) {
            $http.delete('/sak/' + $scope.thing.requested._id).success(function (response) {
                $location.path('/');
            })
        }
    };

    $scope.edit = function () {
        console.log('inside edit');
        $location.path('/#/edit/' + $scope.thing.requested._id);
    }
});

app.controller('EditController', ['$scope', '$location', '$http', 'newThingfactory','newThingservice', function ($scope, $location, $http, newThingfactory, newThingservice) {
    console.log('inside Editcontroller');
    $scope.thing = this;
    $scope.thing.requested = {};
    $scope.id = $location.absUrl().split('/')[5];
    $http.get('/sak/' + $scope.id).success(function (data) {
        $scope.thing.requested = data;
    });

    $scope.cloud = function () {
        console.log('inside cloud');
        cloudinary.openUploadWidget({
                cloud_name: 'angamanga',
                upload_preset: 'errmgao1',
                multiple: false,
                theme: 'minimal'
            },
            function (error, result) {
                $scope.thing.requested.thumbnailpath = result[0].thumbnail_url;
                $scope.thing.requested.photopath = result[0].url;
                var testimg = document.querySelector('#thumbnailimg');
                testimg.src = $scope.thing.requested.thumbnailpath;
            }
        )
    }
    $scope.sendToPreview = function () {newThingservice($scope.thing.requested,$scope.thing.requested.thumbnailpath,$scope.thing.requested.photopath,'/previewAuthEdit/' + $scope.thing.requested._id)};

}]);

app.controller('prevAuthController', ['$scope', '$http', '$location', 'newThingfactory', function ($scope, $http, $location, newThingfactory) {

    console.log('inside prevAuthController');
    $scope.preview = this;
    $scope.preview.newThing = newThingfactory;
    $scope.preview.id = $location.absUrl().split('/')[5];

    $scope.Save = function () {
        console.log('inside save');
        var posting = $http({
            method: 'put',
            url: '/sak/' + $scope.preview.id,
            data: $scope.preview.newThing,
            processData: false
        });
        posting.success(function (response) {
            $location.path('/sak/' + response);
        });
    }
}]);