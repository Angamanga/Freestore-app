var app = angular.module('freestore', []);


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

app.controller('ShowLatestItemsController', ['$http', function ($http) {
        var collection = this;
        collection.things = [];
        console.log(collection.things);
        $http.get('/latest').success(function (data) {
          
            collection.things = data;

        })
        console.log(collection.things);
}]);

app.controller('NewThingController', ['$scope','$http', function ($scope,$http) {
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
    
