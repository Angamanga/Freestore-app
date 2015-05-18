var app = angular.module('freestore', ['ui.router','ngCookies']);

app.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider){ 
    
    $urlRouterProvider.otherwise('/');
     
    $stateProvider
    .state('home',{
        url:'/',
        templateUrl:'/../views/front.html',
        controller: 'mainController'
    })
    .state('new',{
        url:'/new',
        templateUrl:'/../views/new.html',
        controller:'NewThingController',
        controllerAs:'new'
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
 .state('edit',{
    url:'/../views/edit.html',
    controller:'ThingController',
    controllerAs:'thingctrl'})

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
app.service('fileUpload',['$http','$cookieStore','$location',function($http,$cookieStore,$location){
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
        .success(function(data){
          $cookieStore.put('newThing',data);
            var co = $cookieStore.get('newThing');
            console.log(co.title);
              $location.path('/forhandsgranska');
        })
        .error(function(){
        });
       };
}]);

app.service('newThingService',function(){
    var newThing = this;
});
              
app.controller('NewThingController',['$scope', 'fileUpload','$location', 'newThingService',function($scope,fileUpload,$location, newThingService){
    var thumbUrl,imgUrl,testimg; 
    
    $scope.cloud = function(){
        cloudinary.openUploadWidget({cloud_name:'angamanga',
         upload_preset: 'errmgao1', multiple:false, theme:'minimal'},
         function(error, result){
            thumbUrl = result[0].thumbnail_url;
            imgUrl = result[0].url;
            testimg = document.querySelector('#thumbnailimg');
            testimg.src = thumbUrl; 
         }
                                    ) }
    
       $scope.uploadFile = function(){
           var nw = this;
           var uploadUrl = "/nysak";
           nw.newThing = {title:$scope.title,
                         category:$scope.category,
                         contact:{
                             telephone:$scope.telephone,
                             email:$scope.email},
                           description:$scope.description,
                           photopath:imgUrl,
                           thumbnailpath:thumbUrl
                          };
           console.log(uploadUrl);
           console.log(nw.newThing);
           $location.path('/forhandsgranska');
       }
        
}]);   
           
//Controller för sak-sida
app.controller('ThingController',function($scope,$location,$http,$cookieStore){
    console.log('inside Thingcontroller');
    $scope.thing=this;
    $scope.thing.requested={};
    $scope.id = $location.absUrl().split('/')[5];
    console.log($scope.id);
    $http.get('/sak/'+$scope.id).success(function(data){
    $scope.thing.requested=data;
        $cookieStore.put('thing',data);
        
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
app.controller('PreviewController',['$scope','$http','$location','$rootScope','$cookieStore', 'newThingService', function ($scope,$http,$location,$rootScope,$cookieStore, newThingService) {
    console.log('inside preview');
    var pw = this;
    console.log(pw.newThing);
// $scope.THIS=this;    
//    $scope.THIS.newThing={};
//////    $http.get('/newthing').success(function (data) {
////     $scope.THIS.newThing = data;
////    
//    $scope.THIS.newThing = $cookieStore.get('newThing');
//    console.log('cookie:'+JSON.stringify($scope.THIS.newThing));
//
////})
    
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
    