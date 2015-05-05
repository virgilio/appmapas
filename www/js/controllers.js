angular.module('starter.controllers', [])

.controller('MapCtrl', ['$scope', 'Events', '$ionicPopover', function($scope,
            Events, $ionicPopover) {
    var map;
    var SAO_PAULO;
    var options;
    var sdkAvailable = false;
    var div = document.getElementById("map_canvas");

    ionic.Platform.ready(function () {
        if(typeof plugin !== 'undefined') {
            plugin.google.maps.Map.isAvailable(function(isAvailable, message) {
                if (isAvailable) {
                    sdkAvailable = true;
                    SAO_PAULO =
                        new plugin.google.maps.LatLng(-23.562392, -46.655052);
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
                            'zoom': 16,
                        }
                    };

                    map = plugin.google.maps.Map.getMap(div, options);

                    // FIXME it is not working
                    map.addTileOverlay({
                        tileUrlFormat: "http://{s}.tile.osm.org/{zoom}/{x}/{y}.png"
                    }, function(tileOverlay) {
                        mTileOverlay = tileOverlay;
                        map.showDialog();
                    });

                    map.on(plugin.google.maps.event.MAP_READY,
                            showDefaultLocationData);

                    map.on(plugin.google.maps.event.CAMERA_CHANGE,
                            cameraChangeHandler);
                }
                else {
                }
            });
        } else {
            // TODO error handling: no plugin
            // Fallback to leaflet too?
            console.log("Erro em plugin");
        }

        $scope.places = {};
        $scope.markers = {};
        $scope.location = {};

        $scope.getPlaceEvents = function(placeId){
            return Events.placeEvents(placeId);
        }

        function showDefaultLocationData(map){
        }

        function showPlaceData(){
            Events.places($scope.location, new Date())
                .then(function(places){
                    $scope.places = places;
                    $scope.places.forEach(function(place){
                        var curr_position = new plugin.google.maps.LatLng(
                                place.location.latitude,
                                place.location.longitude);
                        var options = {
                            'position' : curr_position,
                        }

                        map.addMarker(options, function(marker){
                            $scope.markers[$scope.markers.length] = marker;
                            marker.addEventListener(
                                    plugin.google.maps.event.MARKER_CLICK,
                                    function(){
                                        marker.hideInfoWindow();
                                        map.setClickable( false );
                                        get_place_events(place.id);
                                    });
                        });

                        Events.place_data(place.id)
                            .then(function(data){
                                place.more = data;
                            });
                    });

                    return places;
                },
                function(data){
                    // TODO error handling
                    return null;
                });
        }

        function cameraChangeHandler(position){
            // TODO The code below is only valid without marker clusters
            if($scope.location.la == position.target.lat
                    && $scope.location.lo === position.target.lng ) return;
            $scope.location.la = position.target.lat;
            $scope.location.lo = position.target.lng;
            showPlaceData();
        }

        function get_place_events($index) {
            Events.place_events($index, new Date())
                .then(function(data){
                    $scope.place_events = data;
                }, function(data){
                    console.log("Err: ", data);
                });
            map.setClickable( true );
        };

        // Filtering options
        $scope.search = {};
        $scope.search.data = '';
        $scope.filter_place_data = function(){
            if($scope.search.data.length > 3){
                var results = [];
                console.log($scope.places.length);
                for(var i = 0; i < $scope.places.length; i++) {
                    var chunk = JSON.stringify($scope.places[i]);
                    if(chunk.indexOf($scope.search.data) != -1) {
                        results.push($scope.places[i]);
                    }
                }
                console.log(JSON.stringify(results));
            }
        }

    });
}])

.controller('EventsCtrl', function($scope, Events, $ionicPopover) {
    /** THIS IS A PLAYGORUND */
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
            return places;
        },
        function(data){
            // TODO error handling
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
