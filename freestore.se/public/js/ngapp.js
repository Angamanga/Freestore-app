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

app.controller('ShowLatestItemsController', function ($scope) {
    $scope.header = "10 senaste tillagda sakerna";
    $scope.things = [{
            "_id": "553f577a896a613b187144ef",
            "title": "Nytt flode",
            "category": "clothes",
            "description": "dsgsdg",
            "contact": {
                "telephone": "0708421257",
                "email": "anna.iosif@me.com"
            },
            "time": 1430214519586,
            "location": "uppsala",
            "photopath": "http://res.cloudinary.com/angamanga/image/upload/v1430214519/qplti6axlayqq70au3xu.png",
            "_locals": {}
                }, {
            "_id": "55469624ad0b9fe6156f3f8c",
            "title": "afsasfg",
            "category": "clothes",
            "description": "adgags                ",
            "contact": {
                "telephone": "0708421258",
                "email": "angamanga@gmail.com"
            },
            "time": 1430689310721,
            "location": "uppsala",
            "photopath": "http://res.cloudinary.com/angamanga/image/upload/v1430689310/pujk85a28vpiacav4puv.jpg",
            "_locals": {}
                },

        {
            "_id": "55473b3f00cbcdf026641269",
            "title": "test innan angular",
            "category": "clothes",
            "description": "asgfasg            ",
            "contact": {
                "telephone": "0708421257",
                "email": "angamanga@gmail.com"
            },
            "time": 1430731577868,
            "location": "uppsala",
            "photopath": "http://res.cloudinary.com/angamanga/image/upload/v1430731577/ybgfahqatk3vuiv0m2w6.png",
            "_locals": {}
                }];

});


app.controller('newThingController', function ($scope) {
    //TODO to be implemented

})