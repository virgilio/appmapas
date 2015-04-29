angular.module('starter.controllers', [])

.controller('MapCtrl', ['$scope', 'Events', function($scope, Events) {
    var map;
    var SAO_PAULO;
    var options; 
    var sdkAvailable = false;
    ionic.Platform.ready(function () {
        plugin.google.maps.Map.isAvailable(function(isAvailable, message) {
            if (isAvailable) {
                sdkAvailable = true; 
                SAO_PAULO = new plugin.google.maps.LatLng(-23.562392, -46.655052);
                options = {
                    'backgroundColor': 'transparent',
                    'mapType': plugin.google.maps.MapTypeId.HYBRID,
                    'controls': {
                        'myLocationButton': true,
                        'indoorPicker': true,
                        'zoom': true
                    },
                    'gestures': {
                        'scroll': true,
                        'tilt': true,
                        'rotate': true,
                        'zoom': true
                    },
                    'camera': {
                        'latLng': SAO_PAULO,
                        'zoom': 15,
                    }
                };

                var div = document.getElementById("map_canvas");
                map = plugin.google.maps.Map.getMap(div, options);
                map.on(plugin.google.maps.event.MAP_READY, showDefaultLocationData);
                // TODO add event listener for search on the map

                // TODO add event listener to camera position change
                map.on(plugin.google.maps.event.CAMERA_CHANGE, cameraChangeHandler);
                
                // ** Events **
                // MAP_CLICK
                // MAP_LONG_CLICK
                // MY_LOCATION_BUTTON_CLICK
                // CAMERA_CHANGE
                // CAMERA_IDLE(iOS)
                // MAP_READY
                // MAP_LOADED(Android)
                // MAP_WILL_MOVE(iOS)
                // MAP_CLOSE
            }
            else {
            }
        });
    });

    function showDefaultLocationData(map){
        // User service to get data near Av Paulista
    }

    function showLocationData(map){
        // TODO add event listener for each marker item on click
        // MARKER_CLICK
    }

    function cameraChangeHandler(position){
        // Get the lat/long and call showLocationData
    }

}])

.controller('EventsCtrl', function($scope, Events, $ionicPopover) {
    $scope.busy = true;
    $scope.location = {
        la: -23.5623921705055,
        lo: -46.6550525229797
    }

    $scope.places = {};
    $scope.eventCount = 0;
    $scope.placeEvents = {};

    Events.places($scope.location, new Date())
        .then(function(places){
            $scope.places = places;
            $scope.places.forEach(function(place){
                Events.place_data(place.id)
                    .then(function(data){
                        place.more = data;
                    });
            });
            console.log($scope.places);
            return places;
        },
        function(data){
            console.log(data);
            return null;
        });

    Events.count($scope.location, new Date())
        .then(function(data){
            $scope.eventCount = data;
        });
    
    $scope.getPlaceEvents = function(placeId){
        return Events.placeEvents(placeId);
    }

     $ionicPopover.fromTemplateUrl('my-popover.html', {
         scope: $scope
     }).then(function(popover) {
         $scope.popover = popover;
     });

     $scope.openPopover = function($event, $index) {
         Events.place_events($index, new Date())
             .then(function(data){
                 $scope.place_events = data;
             }, function(data){
                 console.log("Err: ", data);
             });
         $scope.popover.show($event);
     };
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
