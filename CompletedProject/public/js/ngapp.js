var app = angular.module('freestore');

//factories
//factory för att hantera uppgifter från och till formulär och dela uppgifterna mellan controllers
app.factory('thingFactory', [function () {
    var setThing, getThing, resetThing, thing;

    getThing = function () {
        if (thing !== undefined) {
            return thing;
        } else {
            return {};
        }
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
            photopath: imgUrl || prefix.photopath,
            thumbnailpath: thumbUrl || prefix.thumbnailpath,
            time: Date.now(),
            location: prefix.location
        };
    };

    resetThing = function () {
        thing = {};
    };
    return {
        getThing: getThing,
        setThing: setThing,
        resetThing: resetThing
    };
            }]);

//factory för att hantera bilduppladdning
app.factory('cloudinary', [function () {
    var sendToCloudinary, getImageUrls, imgUrl, thumbUrl;

    getImageUrls = function () {
        return {
            imgUrl: imgUrl,
            thumbUrl: thumbUrl
        };
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
        );
    };

    return {
        sendToCloudinary: sendToCloudinary,
        getImageUrls: getImageUrls
    };
            }]);

//factory för att hantera fel- och rättmeddelanden
app.factory('messageBox', function () {

    var success, successMessage, failure, setSuccess, setFailure, getSuccess, getSuccessMessage, getFailure;
    success = false;
    failure = false;
    setSuccess = function (input, message) {
        success = input;
        successMessage = message;
    };
    getSuccess = function () {
        return success;
    };
    getSuccessMessage = function () {
        return successMessage;
    };
    setFailure = function (input) {
        failure = input;
    };
    getFailure = function () {
        return failure;
    };

    return {
        setSuccess: setSuccess,
        getSuccess: getSuccess,
        getSuccessMessage: getSuccessMessage,
        setFailure: setFailure,
        getFailure: getFailure
    };
});
//controllers

//Hanterar forstasidan
app.controller('HomeController', ['$scope', '$http', 'messageBox', function ($scope, $http, messageBox) {
    var gettingLatest;

    $scope.showSuccess = messageBox.getSuccess();
    $scope.successMessage = messageBox.getSuccessMessage();
    $scope.resultHeading = 'Senast tillagda sakerna';
    $scope.collection = [];

    //hämtar tre senaste sakerna
    gettingLatest = $http.get('/latest');
    gettingLatest.success(function (response) {
        $scope.collection = response;

    });
    gettingLatest.error(function (err) {
        console.log(err);
    });

    //nollställer eventuellt rättmeddelande
    $scope.resetSuccess = function () {
        messageBox.setSuccess(false);
        $scope.showSuccess = false;
    };

    //skickar sökning till servern
    $scope.search = function () {
        $scope.resultHeading = 'Sökresultat';
        var searching = $http({
            method: 'post',
            url: '/search',
            data: {
                searchText: $scope.searchText
            }
        });
        searching.success(function (response) {
            $scope.collection = response;
            if (response.length === 0) {
                $scope.noResult = true;
            } else {
                $scope.noResult = false;
            }

        });
        searching.error(function (err) {
            console.log(err);
        });

    };
            }]);

//Hanterar nysaksform och förhandsgranskning
app.controller('NewThingController', ['$scope', 'thingFactory', 'cloudinary', '$location', function ($scope, thingFactory, cloudinary, $location) {
    var imgUrl, thumbUrl;

    //nollställer eventuellt tidigare lagrade uppgifter som sak
    thingFactory.resetThing();

    $scope.thing = {};
    $scope.formTitle = 'Lägg till en ny sak';
    $scope.imgButtonText = 'Välj en bild';

    //hanterar bilduppladdning
    $scope.cloudinary = function () {
        cloudinary.sendToCloudinary();
    };
    // läser in och sparar information som ska förhandsgranskas 
    $scope.preview = function (isValid) {
        if (isValid) {
            imgUrl = cloudinary.getImageUrls().imgUrl;
            thumbUrl = cloudinary.getImageUrls().thumbUrl;
            thingFactory.setThing($scope.thing, imgUrl, thumbUrl);
            $location.path('/preview/');
        } else {
            $scope.invalidForm = true;
        }

    };
    }]);

//Hanterar ändringar från förhandsgranska innan sak har sparats
app.controller('PreviewEditController', ['$scope', 'thingFactory', 'cloudinary', '$location', function ($scope, thingFactory, cloudinary, $location) {
    var thumbUrl, imgUrl;
    $scope.formTitle = 'Lägg till en ny sak';
    $scope.imgButtonText = 'Välj en bild';
    $scope.thing = thingFactory.getThing();

    $scope.cloudinary = function () {
        cloudinary.sendToCloudinary();
        $scope.newImage = true;
    };

    $scope.preview = function (isValid) {
        if (isValid) {
            if ($scope.newImage) {
                thumbUrl = cloudinary.getImageUrls().thumbUrl;
                imgUrl = cloudinary.getImageUrls().imgUrl;
                thingFactory.setThing($scope.thing, imgUrl, thumbUrl);

            } else {
                thingFactory.setThing($scope.thing);
            }

            $location.path('/preview/');
        } else {
            $scope.invalidForm = true;
        }
    };

            }]);

//hanterar förhandsgranskning av ny sak
app.controller('PreviewController', ['$scope', 'thingFactory', '$http', '$location', 'messageBox', function ($scope, thingFactory, $http, $location, messageBox) {
    console.log('insidePreviewController');
    $scope.previewMode = true;
    $scope.saveButtonText = 'Spara';
    $scope.removeButtonText = 'Rensa';
    $scope.thing = thingFactory.getThing();

    $scope.save = function () {

        var savingData = $http({
            method: 'post',
            url: '/spara',
            data: $scope.thing
        });

        savingData.success(function (response) {
            messageBox.setSuccess(true, 'Din sak sparades!');

            $location.path('/thing/' + response);
        });
        savingData.error(function (err) {
            messageBox.setFailure(true);
            $scope.failureMessage = 'Något gick fel och din sak kunde inte sparas';
        });

    };

    $scope.resetFailure = function () {
        $scope.showFailure = false;
        messageBox.setFailure(false);

    };

}]);

//hanterar visning av sak och ändring av sak
app.controller('ThingController', ['$scope', '$http', 'thingFactory', '$location', 'cloudinary', 'messageBox', function ($scope, $http, thingFactory, $location, cloudinary, messageBox) {
    var gettingThing, imgUrl, thumbUrl;

    $scope.showSuccess = messageBox.getSuccess();
    $scope.newImage = false;
    $scope.formTitle = 'Ändra i din annons';
    $scope.imgButtonText = 'Ändra bild';
    $scope.preview = false;
    $scope.removeButtonText = 'Ta bort annons';
    $scope.id = $location.path().split('/')[2];
    $scope.successMessage = messageBox.getSuccessMessage();

    //hämtar sak från server
    gettingThing = $http.get('/sak/' + $scope.id);
    gettingThing.success(function (data) {
        $scope.thing = data;
        thingFactory.setThing($scope.thing, $scope.thing.photopath, $scope.thing.thumbnailpath);
    });

    $scope.resetSuccess = function () {
        messageBox.setSuccess(false);
        $scope.showSuccess = false;
    };

    gettingThing.error(function (err) {
        console.log(err);
    });

    $scope.cloudinary = function () {
        cloudinary.sendToCloudinary();
        $scope.newImage = true;
    };
    //hanterar information som ska skickas till formulär 
    $scope.preview = function (isValid) {
        if (isValid) {
            if ($scope.newImage) {
                thumbUrl = cloudinary.getImageUrls().thumbUrl;
                imgUrl = cloudinary.getImageUrls().imgUrl;
                thingFactory.setThing($scope.thing, imgUrl, thumbUrl);

            } else {
                thingFactory.setThing($scope.thing);
            }

            $location.path('/preview/' + $scope.id);
        } else {
            $scope.invalidForm = true;

        }
    };
    //tar bort annons från server
    $scope.remove = function (event) {
        event.preventDefault();
        if (confirm('Är du säker på att du vill ta bort din annons?')) {
            var deleting = $http.delete('/sak/' + $scope.id);
            deleting.success(function (response) {
                messageBox.setSuccess(true, 'Din sak togs bort');
                $location.path('/');
            });
            deleting.error(function (err) {
                console.log(err);
            });

        }
    };


            }]);
//hanterar förhandsgranska ändringar i befintlig annons
app.controller('ChangePreviewController', ['$scope', '$location', 'thingFactory', '$http', 'messageBox', function ($scope, $location, thingFactory, $http, messageBox) {
    $scope.previewMode = true;
    $scope.saveButtonText = 'Spara dina ändringar';
    $scope.removeButtonText = 'Ta bort annons';
    $scope.id = $location.path().split('/')[2];
    $scope.thing = thingFactory.getThing();

    //uppdaterar annons i databas
    $scope.save = function () {
        var changing = $http({
            method: 'put',
            url: '/sak/' + $scope.id,
            data: $scope.thing
        });
        changing.success(function (response) {
            messageBox.setSuccess(true, 'Dina ändringar sparades');
            $location.path('/thing/' + response);
        });
        changing.error(function (err) {
            console.log(err);

        });
    };

    //tar bort annons från databas
    $scope.remove = function (event) {
        event.preventDefault();
        if (confirm('Är du säker på att du vill ta bort din annons?')) {
            var deleting = $http.delete('/sak/' + $scope.id);
            deleting.success(function (response) {
                messageBox.setSuccess(true, 'Din sak togs bort');
                $location.path('/');
            });
            deleting.error(function (err) {
                console.log(err);
            });
        }
    };

}]);

//hanterar sidan för att bläddra bland saker
app.controller('BrowseController', ['$scope', '$http', function ($scope, $http) {
    $scope.result = [];
    $scope.showResults = false;
    $scope.thingResults = false;

    //funktioner som hämtar information om antal annonser per kategori eller plats beroende på vad användaren klickar på
    var getThings = function (browse) {
        var getThings = $http.get('/' + browse);
        getThings.success(function (response) {
            $scope.result = response;
        });
        getThings.error(function (err) {});
    };

    $scope.geo = function () {
        getThings('location');
        $scope.browseWhat = 'location';
        $scope.showResults = true;
        $scope.thingResults = false;
        $scope.browseHeading = 'Bläddra geografiskt';
    };
    $scope.category = function () {
        getThings('category');
        $scope.showResults = true;
        $scope.thingResults = false;
        $scope.browseWhat = 'category';
        $scope.browseHeading = 'Bläddra bland kategorier';
    };
    //hämtar alla annonser
    $scope.all = function () {
        $scope.browseHeading = 'alla';
        $scope.showResults = false;
        $scope.thingResults = true;
        getThings('sak');

    };
    //hämtar annonser per kategori eller plats beroende på vad användaren klickar på
    $scope.browseThings = function (searchFor) {
        $scope.browseHeading = searchFor;
        $scope.showResults = false;
        $scope.thingResults = true;
        var searchData = {
            searchFor: searchFor,
            type: $scope.browseWhat
        };
        var things = $http({
            method: 'post',
            url: '/browseSearch',
            data: searchData
        });
        things.success(function (response) {
            $scope.result = response;
        });
        things.error(function (err) {
            console.log(err);
        });
    };
}]);