angular.module('starter.services', [])

.factory('Events', function($http, API) {
    // TODO Refactor, move this to a better place 
    // (READ http://github/hacklabr/mapasculturais)
    var api = {
        entity: {
            EVENT: "/event",
            PLACE: "/space",
        },
        query: {
            COUNTBYLOCATION: "/findByLocation/?@count=1&@from={0}&@to={1}&_geoLocation=GEONEAR({2},{3},{4})",
            FINDPLACES: "/findByEvents/?@from={0}&@to={1}&@select=id,name,location&@order=name%20ASC&_geoLocation=GEONEAR({2},{3},{4})",
            FINDONE: "/findOne/?&id=EQ({0})&@select=id,singleUrl,name,subTitle,type,shortDescription,terms,project.name,project.singleUrl,endereco,endereco,acessibilidade&@files=(avatar.avatarSmall):url",
            FINDBYPLACE: "/findBySpace/?@from={0}&@to={1}&@select=id,singleUrl,name,subTitle,type,shortDescription,terms,project.name,project.singleUrl,endereco,classificacaoEtaria&@order=name%20ASC&spaceId={2}&@files=(avatar.avatarSmall):url"        
        },
        count: function (location, span){
            var query = API + api.entity.EVENT + api.query.COUNTBYLOCATION;
            var the_query = this.format(query, span.from, span.to, location.lo, location.la, 1500);
            return $http.get(the_query)
                .success(function (data, status, headers, config){
                })
            .error(function(data, status, headers,config){
                // TODO create error handling
                console.log(status);
                console.log(data);
                console.log(config);
                console.log(headers);
            });
        },
        findPlaces: function(location, span){
            var query = api.url + api.entity.PLACE + api.query.FINDPLACES;
            the_query = this.format(query, span.from, span.to, location.lo, location.la, 1500);
            $http.get(the_query)
                .success(function (data, status, headers, config){ 
                    return data;
                })
            .error(function(data, status, headers,config){
                // TODO  create error handling
                console.log(status);
                console.log(data);
                console.log(config);
                console.log(headers);
            });

        },
        findPlaceData: function(){
            // TODO run find 
            var query = API + api.entity.PLACE  + api.query.FINDONE;
            var the_query = this.format(query, place_id);
            console.log(the_query);
            return $http.get(the_query)
                .success(function (data, status, headers, config){
                })
            .error(function(data, status, headers,config){
                console.log(status);
                // TODO create error handling
            }).then(function(data){
                return data.data;
            });
        },
        findEventsFromPlace: function(){
            // TODO find space events
            var query = API + api.entity.EVENT + api.query.FINDBYPLACE;
            var the_query = this.format(query, span.from, span.to, place_id);
            return $http.get(the_query)
                .success(function (data, status, headers, config){
                })
            .error(function(data, status, headers,config){
                console.log(status);
                // TODO create error handling
            }).then(function(data){
                return data.data;
            });
        },
        format: function (format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) { 
                return typeof args[number] != 'undefined'
                    ? args[number] 
                    : match
                    ;
            });
        },
        monthSpan: function(date){
            // TODO better way to format date
            from = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
            to = date.getFullYear() + "-" + (date.getMonth()+2) + "-" + date.getDate();
            return [from, to];
        }
    };

    return {
        /** 
         * Count all places nearby *location* in the day *date*
         **/
        count: function(location, date) {
            return api.count(location, api.monthSpan(date));
        },
        /** 
         * Get all places the have events nearby *location* in the day *date*
         **/
        places: function(location, date) {
            return api.findPlaces(location, api.monthSpan(date));
        },
        placeData: function(placeId){
            return null;
        },
        placeEvents: function(placeId){
            return null;
        }
    };
});


