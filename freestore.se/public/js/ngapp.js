var app = angular.module('freestore', ['ui.router','ngFileUpload']);

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
        url:'/new',
        templateUrl:'/../views/new.html',
        controller:'NewThingController'
    })
    .state('preview',{
        url:'/forhandsgranska',
        templateUrl:'/../views/preview.html',
        controller:'PreviewController',
        controllerAs:'prevctrl'
    })
//    .state('previewEdit',{
//        url:'/forhandsgranskaEdit',
//        templateUrl:'/../views/previewEdit.html',
//        controller:'PreviewController',
//        controllerAs:'prevctrl'
//    })
.state('thing',{
        url:'/sak/:id',
        templateUrl:'/../views/thing.html',
        controller:'ThingController',
        controllerAs:'thingctrl'
    })
//    .state('edit',{})

}]);
//Förstasidan           
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

//Controller för latest items (förstasidan)
app.controller('ShowLatestItemsController', ['$http', function ($http) {
        var collection = this;
        collection.things = [];
        console.log(collection.things);
        $http.get('/latest').success(function (data) {
          console.log(data);
            collection.things = data;

        })
        console.log(collection.things);
}]);
//directive for input file

app.directive('fileModel',['$parse',function($parse){
    return{
        restrict:'A',
        link:function(scope,element,attrs){
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change',function(){
                scope.$apply(function(){
                    modelSetter(scope,element[0].files[0]);
                });
            });
        }
    };
}]);
//service to override default behaviour 
app.service('fileUpload',['$http',function($http){
       this.uploadFileAndFieldsToUrl = function(file, fields,uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        for(var i = 0; i < fields.length; i++){
        fd.append(fields[i].name, fields[i].data)
        }
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
       };
}]);
app.controller('NewThingController',['$scope', 'fileUpload','$location',function($scope,fileUpload,$location){
     
     $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "/nysak";
        var fields = [{"name":"title","data":$scope.title},
                      {"name":"category","data":$scope.category},
                      {"name":"telephone","data":$scope.telephone},
                      {"name":"email","data":$scope.email},
                      {"name":"description","data":$scope.description}
                     ];
        fileUpload.uploadFileAndFieldsToUrl(file, fields, uploadUrl);
        
         $location.path('/forhandsgranska');
    //TODO: Las in newThingfilen som skickas fran servern. Hur anvanda den for forhandsgranskning? 
    //Anvanda samma controller? Gora en separat http.get? Maste serva ut objektet pa ngt vis....
     };
}]);   

               
               
//Controller för sak-sida
app.controller('ThingController',function($scope,$location,$http){
    console.log('inside Thingcontroller');
    $scope.thing=this;
    $scope.thing.requested={};
    $scope.id = $location.absUrl().split('/')[5];
    console.log($scope.id);
    $http.get('/sak/'+$scope.id).success(function(data){
    $scope.thing.requested=data;
    console.log($scope.thing.requested);
    });
    
    $scope.delete = function(event){
        
        console.log(event);
        console.log($scope.thing.requested._id);
        event.preventDefault();
        if(confirm('Är du säker på att du vill ta bort din annons?')){
            
            $http.delete('/sak/' + $scope.thing.requested._id ).success(function(response){
                $location.path('/');
        })
                    
    }
};
});


//Controller for Preview
app.controller('PreviewController',['$scope','$http','$location','$rootScope', function ($scope,$http,$location,$rootScope) {
    console.log('inside preview');
    $scope.THIS=this;    
    $scope.THIS.newThing={};
    $http.get('/newthing').success(function (data) {
     $scope.THIS.newThing = data;
    })
    
    $scope.Save = function(){
        console.log('inside save'); 
        var posting =  $http({
              method:'post',
              url:'/spara',
              data:$scope.THIS.newThing,
              processData:false})
        posting.success(function(response){
            console.log('RESPONSE'+response);
           $location.path('/sak/'+response);
           // $scope.$apply();
        });
       }

}]);
    