var app = angular.module('freestore', ['ui.router', 'ngCookies']);
//configs
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/../views/front.html',
            controller: 'mainController',
            controllerAs: 'collection'
        })
        .state('new', {
            url: '/new',
            templateUrl: '/../views/new.html',
            controller: 'NewThingController',
            controllerAs: 'new'
        })
        .state('preview', {
            url: '/forhandsgranska',
            templateUrl: '/../views/preview.html',
            controller: 'PreviewController',
            controllerAs: 'prevctrl'
        })
        .state('previewEdit', {
            url: '/previewEdit',
            templateUrl: '/../views/previewEdit.html',
            controller: 'PrevEditController',
            controllerAs: 'prevedit'
        })
        .state('thing', {
            url: '/sak/:id',
            templateUrl: '/../views/thing.html',
            controller: 'ThingController',
            controllerAs: 'thingctrl'
        })
        .state('edit', {
            url: '/edit/:id',
            templateUrl: '/../views/edit.html',
            controller: 'EditController',
            controllerAs: 'editctrl'
        })
        .state('login', {
            url: '/login/:id',
            templateUrl: '/../views/thingauth.html',
            controller: 'ThingController',
            controllerAs: 'thingctrl'
        })
    .state('previewAuthEdit',{
        url:'/previewAuthEdit/:id',
        templateUrl:'/../views/previewAuth.html',
        controller:'prevAuthController',
        controllerAs:'prevauthctrl'
        
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
        location:''
    };     
    console.log(newThing);
return newThing;
    
});





//Förstasidan           
app.controller('mainController', ['$scope', '$http', function ($scope, $http) {
    $scope.resultHeading = 'Senast tillagda sakerna';
    $scope.collection = this;
    $scope.collection.things = [];
    $http.get('/latest').success(function (data) {
        $scope.collection.things = data;
    })
    $scope.collection.searchText = $scope.searchText;

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


app.controller('NewThingController', ['$scope', '$location', 'newThingfactory', function ($scope, $location, newThingfactory) {
    var thumbUrl, imgUrl, testimg;

    $scope.cloud = function () {
        console.log('inside NewThingController');
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
    console.log(newThingfactory);
   
    $scope.uploadFile = function () {
        console.log('inside send to preview');
        console.log($scope.title);
        console.log(newThingfactory);
        newThingfactory.title = $scope.title;
        newThingfactory.category = $scope.category;
        newThingfactory.contact.telephone = $scope.telephone;
        newThingfactory.contact.email = $scope.email;
        newThingfactory.description = $scope.description;
        newThingfactory.photopath =imgUrl;
        newThingfactory.thumbnailpath = thumbUrl;
        newThingfactory.time = Date.now();
        console.log(newThingfactory);

        $location.path('/forhandsgranska');
    }
  

}]);

//Controller for Preview
app.controller('PreviewController', ['$scope', '$http', '$location', '$rootScope', 'newThingfactory', function ($scope, $http, $location, $rootScope, newThingfactory) {
    console.log('inside preview');
    $scope.preview = this;
    $scope.preview.newThing = newThingfactory;
    console.log($scope.preview.newThing);
   
    $scope.Save = function () {
        console.log('inside save');
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
app.controller('PrevEditController', ['$scope', 'newThingfactory', '$location', function ($scope, newThingfactory, $location) {
    console.log('inside EditController');
    $scope.thingToEdit = newThingfactory;
    console.log($scope.thingToEdit.title);
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
        console.log(category);
        for (var i = 0; i < category.options.length; i++) {
            if (category.options[i].value === selectedValue) {
                category.options[i].selected = true;
                break;
            }
        }
    }
   

    $scope.sendToPreview = function () {
        console.log('inside send to preview');
        newThingfactory.title = $scope.thingToEdit.title;
        newThingfactory.category = $scope.thingToEdit.category;
        newThingfactory.contact.telephone = $scope.thingToEdit.contact.telephone;
        newThingfactory.contact.email = $scope.thingToEdit.contact.email;
        newThingfactory.description = $scope.thingToEdit.description;
        newThingfactory.photopath = $scope.thingToEdit.photopath;
        newThingfactory.thumbnailpath = $scope.thingToEdit.thumbnailpath;
        newThingfactory.time = Date.now();
        console.log(newThingfactory);

        $location.path('/forhandsgranska');
    }

}]);


//Controller för sak-sida
app.controller('ThingController', function ($scope, $location, $http) {
    console.log('inside Thingcontroller');
    $scope.thing = this;
    $scope.thing.requested = {};
    $scope.id = $location.absUrl().split('/')[5];
    console.log($scope.id);
    $http.get('/sak/' + $scope.id).success(function (data) {
        $scope.thing.requested = data;
    });

    $scope.delete = function (event) {

        console.log(event);
        console.log($scope.thing.requested._id);
        event.preventDefault();
        if (confirm('Är du säker på att du vill ta bort din annons?')) {

            $http.delete('/sak/' + $scope.thing.requested._id).success(function (response) {
                $location.path('/');
            })

        }
    };
    
    $scope.edit = function(){
        $location.path('/#/edit/'+$scope.thing.requested._id);
    }
    

});

app.controller('EditController',['$scope','$location','$http','newThingfactory',function($scope,$location,$http,newThingfactory){
    
    console.log('inside Editcontroller');
    $scope.thing = this;
    $scope.thing.requested = {};
    $scope.id = $location.absUrl().split('/')[5];
    console.log($scope.id);
    $http.get('/sak/' + $scope.id).success(function (data) {
        $scope.thing.requested = data;
    });
    
     $scope.cloud = function () {
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
     
     
    $scope.sendToPreview = function () {
        console.log('inside send to preview');
        newThingfactory.title = $scope.thing.requested.title;
        newThingfactory.category = $scope.thing.requested.category;
        newThingfactory.contact.telephone = $scope.thing.requested.contact.telephone;
        newThingfactory.contact.email = $scope.thing.requested.contact.email;
        newThingfactory.description = $scope.thing.requested.description;
        newThingfactory.photopath = $scope.thing.requested.photopath;
        newThingfactory.thumbnailpath = $scope.thing.requested.thumbnailpath;
        newThingfactory.time = Date.now();
     
        $location.path('/previewAuthEdit/'+$scope.thing.requested._id);
    }




}]);

app.controller('prevAuthController',['$scope','$http','$location','newThingfactory',function($scope,$http,$location,newThingfactory){
 
     console.log('inside prevAuthController');
    $scope.preview = this;
    $scope.preview.newThing = newThingfactory;
    console.log(newThingfactory);
    console.log($scope.preview.newThing);
    $scope.preview.id = $location.absUrl().split('/')[5];
    console.log($scope.preview.id);
    
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

