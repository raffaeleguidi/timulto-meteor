function clientGeocode (lat, lon, cb) {
        /*http://open.mapquestapi.com/nominatim/v1/reverse.php?format=json&lat=51.521435&lon=-0.162714*/
        /*var obj = HTTP.get("http://nominatim.openstreetmap.org/reverse",*/
        var obj = HTTP.get("http://open.mapquestapi.com/nominatim/v1/reverse.php",
                           { params: {
                                 format: "json",
                                 lat: lat,
                                 lon: lon
                             }}, function(err, res){
            try {
                    if(res.statusCode==200) {
                        //console.log(res);
                        var data = JSON.parse(res.content);
                        var address = data.address.road + (data.address.house_number ? ", " + data.address.house_number : "");
                        var city = data.address.city;
                        var postcode = data.address.postcode;

                        cb( null, {
                            address: address,
                            postcode: postcode,
                            city: city
                        })
                    } else {
                        cb({
                                code: 'HTTP-' + res.statusCode,
                                message: 'reverse geocoding error'
                        }, {
                            address: "Lat: " + lat + ", Lon: " + lon,
                            postcode: 'geocoding error',
                            city: res.statusCode
                        })
                    }
                } catch (ex) {
                    cb({
                                code: 'exception',
                                message: 'reverse geocoding error'
                        }, {
                        address: "Lat: " + lat + ", Lon: " + lon,
                        postcode: 'geocoding error',
                        city: ex.message
                    })
                }
        });

}

//Tracker.autorun(function () {
//  var coords = Geolocation.latLng();
//
//    if (coords && coords.lat && coords.lng) {
//        Session.set("lat",coords.lat);
//        Session.set("lon",coords.lng);
//        console.log("coords  " + JSON.stringify(coords));
//    }
//});
//
geoLocalization = {

    latLng: function() {
        try {
//            console.log("latLng");
            var coords = Geolocation.latLng();
            
            if (coords && coords.lat && coords.lng) {
//                console.log("nuove coordinate trovate");
                Session.set("lat",coords.lat);
                Session.set("lon",coords.lng);
                return {
                        lat:coords.lat,
                        lon:coords.lng
                       }
            }
        } catch(err) {
            console.log("error geocoding " + err.message);
        }
    },
    geocode: function() {
        try {
            console.log("in geocode");
            var coords = Geolocation.latLng();
            console.log("geocode coords %s", JSON.stringify(coords));
            if (coords && coords.lat && coords.lng) {
                /*Meteor.call("reverseGeocode", coords.lat, coords.lng, function(error, results) {*/
                clientGeocode( coords.lat, coords.lng, function(error, results) {
                    if (error) {
                        console.error('skipping reverse geocode becaus of error: ' + error.message + ' (' + error.code + ')');
                        return;
                    }

                    var address = results.address + ' - ' + results.postcode + ' ' + results.city;
                    Session.set("address", address);
                    Session.set("city", results.city);
                    Session.set("lat",coords.lat);
                    Session.set("lon",coords.lng);
                    console.log("address taken in geoLocalization");
                    $('#address').val(address);
                });
            } else {
                console.error("#geocode - lat/lng not set");
            }
        } catch(err) {
            console.error("error geocoding " + err.message);
        }
    }
};
