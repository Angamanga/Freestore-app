//Borja med:
//put och delete

var app = angular.module('freestore');

//factories
app.factory('thingFactory', [function () {
    var setThing, getThing, resetThing, thing;

    getThing = function () {
        if (thing !== undefined) {
            return thing;
        } else {
            return {};
        };
    }

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
        }
    };

    resetThing = function () {
        thing = {};
    };
    return {
        getThing: getThing,
        setThing: setThing,
        resetThing: resetThing
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

//Hanterar forstasidan
app.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    var gettingLatest;
    $scope.resultHeading = 'Senast tillagda sakerna';
    $scope.collection = [];
    gettingLatest = $http.get('/latest');
    gettingLatest.success(function (response) {
        $scope.collection = response;
        console.log($scope.collection);
    });
    gettingLatest.error(function (err) {
        console.log(err);
    });

    $scope.search = function () {
        console.log('inside search');
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
            if (response.length == 0) {
                $scope.noResult = true;
            } else {
                $scope.noResult = false;
            }
            console.log(response.length);



        });
        searching.error(function (err) {
            console.log(err);
        });

    };
            }]);

//Hanterar nysaksform och previewEdit
app.controller('NewThingController', ['$scope', 'thingFactory', 'cloudinary', '$location', function ($scope, thingFactory, cloudinary, $location) {
    var imgUrl, thumbUrl;

    thingFactory.resetThing();

    $scope.thing = {};
    $scope.formTitle = 'Lägg till en ny sak';
    $scope.imgButtonText = 'Välj en bild';

    $scope.cloudinary = function () {
        cloudinary.sendToCloudinary();
    }

    $scope.preview = function (isValid) {
        if (isValid) {
            imgUrl = cloudinary.getImageUrls().imgUrl;
            thumbUrl = cloudinary.getImageUrls().thumbUrl;
            console.log($scope.thing);
            thingFactory.setThing($scope.thing, imgUrl, thumbUrl);
            $location.path('/preview/');
        } else {
            $scope.invalidForm = true;
        }

    }
    }]);

app.controller('PreviewEditController', ['$scope', 'thingFactory', 'cloudinary', '$location', function ($scope, thingFactory, cloudinary, $location) {
    var thumbUrl, imgUrl;
    console.log(document.getElementById('selectLocation'));

    $scope.formTitle = 'Lägg till en ny sak';
    $scope.imgButtonText = 'Välj en bild';
    $scope.thing = thingFactory.getThing();

    $scope.cloudinary = function () {
        cloudinary.sendToCloudinary();
        $scope.newImage = true;
    }

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
    }

            }]);

//hanterar förhandsgranska ny sak och editera efter förhandsgranskning
app.controller('PreviewController', ['$scope', 'thingFactory', '$http', '$location', function ($scope, thingFactory, $http, $location) {
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
            $location.path('/thing/' + response);
        });
        savingData.error(function (err) {
            console.log(err);
        });

    }
}]);

//hanterar visning av sak samt ändring av befintlig sak(ska den det?);
app.controller('ThingController', ['$scope', '$http', 'thingFactory', '$location', 'cloudinary', function ($scope, $http, thingFactory, $location, cloudinary) {
    console.log('inside Thingcontroller');
    var gettingThing, imgUrl, thumbUrl;
    console.log(document.getElementById('selectLocation'));
    $scope.newImage = false;
    $scope.formTitle = 'Ändra i din annons';
    $scope.imgButtonText = 'Ändra bild';
    $scope.preview = false;
    $scope.removeButtonText = 'Ta bort annons'
    $scope.id = $location.path().split('/')[2];

    gettingThing = $http.get('/sak/' + $scope.id);
    gettingThing.success(function (data) {
        $scope.thing = data
        thingFactory.setThing($scope.thing, $scope.thing.photopath, $scope.thing.thumbnailpath);
    });

    gettingThing.error(function (err) {
        console.log(err);
    });

    $scope.cloudinary = function () {
        cloudinary.sendToCloudinary();
        $scope.newImage = true;
    }

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
    }

    $scope.remove = function (event) {
        event.preventDefault();
        if (confirm('Är du säker på att du vill ta bort din annons?')) {
            var deleting = $http.delete('/sak/' + $scope.id);
            deleting.success(function (response) {
                console.log('annonsen är borttagen');
                $location.path('/');
            });
            deleting.error(function (err) {
                console.log(err);
            });

        }
    }
            }]);

app.controller('ChangePreviewController', ['$scope', '$location', 'thingFactory', '$http', function ($scope, $location, thingFactory, $http) {
    $scope.previewMode = true;
    $scope.saveButtonText = 'Spara dina ändringar';
    $scope.removeButtonText = 'Ta bort annons';
    $scope.id = $location.path().split('/')[2];
    $scope.thing = thingFactory.getThing();
    $scope.save = function () {
        var changing = $http({
            method: 'put',
            url: '/sak/' + $scope.id,
            data: $scope.thing
        });
        changing.success(function (response) {
            $location.path('/thing/' + response);
        });
        changing.error(function (err) {
            console.log(err);

        });
    };

    $scope.remove = function (event) {
        event.preventDefault();
        if (confirm('Är du säker på att du vill ta bort din annons?')) {
            var deleting = $http.delete('/sak/' + $scope.id);
            deleting.success(function (response) {
                console.log('annonsen är borttagen');
                $location.path('/');
            });
            deleting.error(function (err) {
                console.log(err);
            });
        }
    }

}]);

app.controller('BrowseController', ['$scope', '$http', function ($scope, $http) {
    console.log('inside BrowseController');
    $scope.result = [];
    $scope.showResults = false;
    $scope.thingResults = false;

    var getThings = function (browse) {
        var getThings = $http.get('/' + browse);
        getThings.success(function (response) {
            $scope.result = response;
            console.log(response);
        });
        getThings.error(function (err) {});
    }

    $scope.geo = function () {
        getThings('location');
        $scope.browseWhat = 'location';
        $scope.showResults = true;
        $scope.thingResults = false;
        $scope.browseHeading = 'Bläddra geografiskt';
    }
    $scope.category = function () {
        getThings('category');
        $scope.showResults = true;
        $scope.thingResults = false;
        $scope.browseWhat = 'category';
        $scope.browseHeading = 'Bläddra bland kategorier';
    };

    $scope.all = function () {
        $scope.showResults = false;
        $scope.thingResults = true;
        getThings('sak');

    }

    $scope.browseThings = function (searchFor) {
        console.log('inside BrowseTHings');
        $scope.showResults = false;
        $scope.thingResults = true;
        var searchData = {
            searchFor: searchFor,
            type: $scope.browseWhat
        };
        console.log(searchData);

        var things = $http({
            method: 'post',
            url: '/browseSearch',
            data: searchData
        });
        things.success(function (response) {
            $scope.result = response;
            console.log(response);
        });
        things.error(function (err) {
            console.log(err)
        });
    };


}]);