var app = angular.module('freestore');

//factories
app.factory('thingFactory', [function () {
    var setThing, getThing, thing;

    getThing = function () {
        return thing;
    };

    setThing = function (prefix, imgUrl, thumbUrl) {
        thing = {
            title: prefix.title,
            category: prefix.category,
            firstName: prefix.firstName,
            lastName: prefix.lastName,
            telephone: prefix.telephone,
            email: prefix.email,
            description: prefix.description,
            photopath: imgUrl,
            thumbnailpath: thumbUrl,
            time: Date.now(),
            location: prefix.location
        }

    };

    return {
        getThing: getThing,
        setThing: setThing
    }


}]);

app.factory('cloudinary', [function () {
    var sendToCloudinary, getImageUrls, imgUrl, thumbUrl;
    getImageUrls = function () {
        return {
            imgUrl: imgUrl,
            thumbUrl: thumbUrl
        }
    };

    sendToCloudinary = function () {
        cloudinary.openUploadWidget({
                cloud_name: 'angamanga',
                upload_preset: 'errmgao1',
                multiple: false,
                theme: 'minimal'
            },
            function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    imgUrl = result[0].url;
                    thumbUrl = result[0].thumbnail_url;
                    document.querySelector('#thumbnailimg').src = thumbUrl;


                }
            }
        )


    }

    return {
        sendToCloudinary: sendToCloudinary,
        getImageUrls: getImageUrls
    }
            }]);

//controllers



app.controller('NewThingController', ['$scope', 'thingFactory', 'cloudinary', '$location', function ($scope, thingFactory, cloudinary, $location) {
    $scope.thing = {};
    var imgUrl, thumbUrl;
    $scope.cloudinary = function () {
        cloudinary.sendToCloudinary();

    }

    $scope.preview = function () {
        imgUrl = cloudinary.getImageUrls().imgUrl;
        thumbUrl = cloudinary.getImageUrls().thumbUrl;
        thingFactory.setThing($scope.thing, imgUrl, thumbUrl);
        $location.path('/preview');

    }
    }]);

app.controller('PreviewController', ['$scope', 'thingFactory', '$http', '$location', function ($scope, thingFactory, $http, $location) {
    console.log('insidePreviewController');
    $scope.thing = thingFactory.getThing();
    $scope.save = function () {
        var savingData = $http({
            method: 'post',
            url: '/spara',
            data: $scope.thing
        });

        savingData.success(function (response) {
            $location.path('/thing/' + response);
        });
        savingData.error(function (response) {
            console.log('ett fel inträffade och din sak kunde inte sparas');
        });

    }
   }]);

//borja har! Edit laser in i new.html Problem med bild. 
app.controller('EditController', ['$scope', 'thingFactory', function ($scope, thingFactory) {
    console.log('inside Edit');
    $scope.thing = thingFactory.getThing();


}]);

app.controller('ThingController', [function () {}]);