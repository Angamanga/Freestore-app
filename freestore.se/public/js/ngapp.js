var app = angular.module('freestore', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider)
           {
               $urlRouterProvider.otherwise('/');
               
    console.log('inside config');
    $stateProvider
    .state('home',{
        url:'/',
        templateUrl:'/../views/front.html',
        controller: 'mainController'
    })
    .state('new',{
        url:'/nysak',
        templateUrl:'/../views/newThing.html',
        controller:'NewThingController'
    })
}]);
           
app.controller('mainController', function ($scope) {
    $scope.search = {
        searchText: ''
    };
    $scope.searches = [];
    $scope.newThing = {
        create_by: '',
        text: '',
        created_at: ''
    };
});

app.controller('ThingController',function($scope,$location,$http){
    console.log('inside Thingcontroller');
    $scope.thing=this;
    $scope.thing.requested={};
    $scope.id = $location.absUrl().split('/')[4];
    $http.get('/sakid/'+$scope.id).success(function(data){
    $scope.thing.requested=data;
    console.log($scope.thing.requested);
    });
});

app.controller('ShowLatestItemsController', ['$http', function ($http) {
        var collection = this;
        collection.things = [];
        console.log(collection.things);
        $http.get('/latest').success(function (data) {
          
            collection.things = data;

        })
        console.log(collection.things);
}]);

app.controller('NewThingController', ['$scope','$http','$route', function ($scope,$http,$route) {
    $scope.THIS=this;    
     $scope.THIS.newThing={};
       
        console.log( $scope.THIS.newThing);
        $http.get('/newthing').success(function (data) {
            console.log('data:'+data);
             $scope.THIS.newThing = data;
        })
        console.log('newThing'+ $scope.THIS.newThing);

    $scope.Save = function(){
          var posting =  $http({
              method:'post',
              url:'/spara',
              data:$scope.THIS.newThing,
              processData:false})
        posting.success(function(response){
            console.log(response);
            $scope.response.data = response;
        });
    
    console.log('postar:' +  $scope.THIS.newThing);
    }

}]);
    