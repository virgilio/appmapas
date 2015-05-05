angular.module('starter.services', [])

.factory('Events', function($http, API) {
    // TODO Refactor, move this to a better place
    // (READ http://github/hacklabr/mapasculturais)
    var api = {
        default_radius : 2000,
        entity: {
            EVENT: "/event",
            PLACE: "/space",
        },
        query: {
            COUNTBYLOCATION: "/findByLocation/?@count=1&@from={0}&@to={1}&_geoLocation=GEONEAR({2},{3},{4})",
            FINDPLACES: "/findByEvents/?@from={0}&@to={1}&@select=id,name,location,description&@order=name%20ASC&_geoLocation=GEONEAR({2},{3},{4})",
            FINDALLPLACES: "/findByEvents/?@from={0}&@to={1}&@select=id,name,location,description&@order=name%20ASC",
            FINDONE: "/findOne/?&id=EQ({0})&@select=id,singleUrl,name,subTitle,type,shortDescription,terms,project.name,project.singleUrl,endereco,endereco,acessibilidade&@files=(avatar.avatarSmall):url",
            FINDBYPLACE: "/findBySpace/?@from={0}&@to={1}&@select=id,singleUrl,name,subTitle,type,shortDescription,terms,project.name,project.singleUrl,endereco,classificacaoEtaria&@order=name%20ASC&spaceId={2}&@files=(avatar.avatarSmall):url"
        },
        count: function (location, span){
            var query = API + api.entity.EVENT + api.query.COUNTBYLOCATION;
            var the_query = this.format(query, span.from, span.to,
                    location.lo, location.la, api.default_radius);
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
        find_places: function(location, span){
            var query = API + api.entity.PLACE + api.query.FINDPLACES;
            var the_query = this.format(query, span.from, span.to,
                    location.lo, location.la, api.default_radius);

            // console.log(the_query);
            return $http.get(the_query)
                .success(function (data, status, headers, config){
                })
            .error(function(data, status, headers,config){
                console.log(status);
                // TODO  create error handling
            }).then(function(data){
                return data.data;
            });

        },
        find_place_data: function(place_id){
            // TODO run find
            var query = API + api.entity.PLACE  + api.query.FINDONE;
            var the_query = this.format(query, place_id);
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
        find_events_from_place: function(place_id, span){
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
            return format.replace(/{(\d+)}/g,
                    function(match, number) {
                        return typeof args[number] != 'undefined'
                            ? args[number]
                            : match;
                    });
        },
        month_span: function(date){
            // TODO better way to format date
            from = date.getFullYear()
                + "-" + (date.getMonth()+1)
                + "-" + date.getDate();
            to = date.getFullYear()
                + "-" + (date.getMonth()+2)
                + "-" + date.getDate();
            return {from: from, to: to};
        }
    };

    return {
        /**
         * Count all places nearby *location* in the day *date*
         **/
        count: function(location, date) {
            return api.count(location, api.month_span(date));
        },
        /**
         * Get all places the have events nearby *location* in the day *date*
         **/
        places: function(location, date) {
            return api.find_places(location, api.month_span(date));
        },
        place_data: function(place_id){
            return api.find_place_data(place_id);
        },
        place_events: function(place_id, date){
            return api.find_events_from_place(place_id, api.month_span(date));
        }
    };
});


