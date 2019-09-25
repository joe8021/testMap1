//variable which contains map
var map;
//varaible to store directions
var service;
//variable to display map
var infowindow;
//variable to store user input
var searchVal;
//variable to hold formatted current location(after being geocoded)
var formattedCurrentLoc = "";

//console.log(closestFound);

//hide directions button until search button is clicked
$("#directions").hide();

//hide container which displays the address of the nearest location until found
$("#nearestFound").hide();

//reload the page on click which refocuses map to users current location
$("#currentLocation").on("click", function () {
    location.reload();

})

//run function to get and display directions on click
$("#directions").on("click", function () {

    initMap();
})



//on click, search for nearest location of input search term and display the address
$("#userSearch").on("click", function(){
    searchVal = $(".placeSearch").val()
    console.log("searchVal: " + searchVal)
    testPos();
    $("#directions").show();
    $("#nearestFound").show();
    closestFound.textContent = "Closest Location Found: " + formattedAddress;
    console.log("user: " + closestFound.textContent);
    
})

//this function calculates the route and displays it on the map as well in the form of a list of directions
function initMap() {
    //$("#currentlocation").hide()

    function calculateAndDisplayRoute(directionsService, directionsRenderer) {
        //varaible to store current location 
        var currentPosition = {};

        var map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -33.8688, lng: 151.2195 },
            zoom: 13,
            mapTypeId: 'roadmap'
        });


        infoWindow = new google.maps.InfoWindow;

        //finds current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                //console.log(pos);

                infoWindow.setPosition(currentPosition);
                infoWindow.setContent('Location found.');
                infoWindow.open(map);
                map.setCenter(currentPosition);
                //console.log(map.setCenter());
            }, function () {
                handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
        }

        var directionsRenderer = new google.maps.DirectionsRenderer;
        console.log(directionsRenderer);
        var directionsService = new google.maps.DirectionsService;
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: 41.85, lng: -87.65 }
        });
        directionsRenderer.setMap(map);
        directionsRenderer.setPanel(document.getElementById('right-panel'));

        //get origin and end spot for the directions 

        //console.log(currentPosition.lat);

        var start = formattedAddress;
        var end = formattedCurrentLoc;
        directionsService.route({
            origin: start,
            destination: end,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                directionsRenderer.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }

    calculateAndDisplayRoute();
    
   

}


//this function returns the map to the users current location
function currentLocation() {
    //sets initial map
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    infoWindow = new google.maps.InfoWindow;

    //finds current location
    currentPosition2 = "";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentPosition2 = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            // return currentPosition;


            // saves current location
            testPos(currentPosition2);
            //nearBy(currentPosition2);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}

//gloabl variable to store current location
var currentPosition2;

//this saves the current location into a variable as soon as the page loads
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        currentPosition2 = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        // return currentPosition;


        // saves current location
        testPos(currentPosition2);
        console.log(currentPosition2.lat);
    }
    )
}


//this function saves the current location into a variable, goecodes it and then does the same for finding the nearest searched location 
function testPos(arg) {
    //console.log(arg);
    var lat = currentPosition2.lat;
    var lng = currentPosition2.lng;
    console.log(lat);

    // console.log("postion after switch" + JSON.stringify(yourPosition1));
    console.log("lat " + lat);
    console.log("lng " + lng);
    var closestFound = document.getElementById("nearestFound");


    //stores current location based off the lat and long and geocodes it into an address
    $.ajax({

        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDxTdbiQM9NRtUgYe3cYN86iuXIleDgb04`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            // console.log("URL: " + url)
            // console.log("Success " + data)  
            // console.log("Success Stringified" + JSON.stringify(data))  
            //console.log("Formatted Address: " + data.results[0].formatted_address)            
            formattedCurrentLoc = data.results[0].formatted_address;
            console.log(formattedCurrentLoc);
            

        },
        error: function (request, error) {
            alert("Request: " + JSON.stringify(request));
        }
    },

        //stores lat and long of the nearest location of the searched term and geocodes it into an address 
        $.ajax({

            url: `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${searchVal}&inputtype=textquery&fields=photos,formatted_address,name,opening_hours,rating&locationbias=circle:1000@${lat},${lng}&key=AIzaSyDxTdbiQM9NRtUgYe3cYN86iuXIleDgb04`,
            type: 'GET',
            dataType: 'json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            success: function (data) {
                // console.log("URL: " + url)
                // console.log("Success " + data)  
                // console.log("Success Stringified" + JSON.stringify(data))  
                //console.log("Formatted Address: " + data.results[0].formatted_address)            
                formattedAddress = data.candidates[0].formatted_address;
                console.log(formattedAddress);
                closestFound.textContent = "Closest Location Found: " + formattedAddress;

            },
            error: function (request, error) {
                alert("Request: " + JSON.stringify(request));
            }
        })
    );
}


function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -33.8688, lng: 151.2195 },
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            //console.log(map.setCenter(pos));
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    // Create the search box and link it to the UI element.
    var input = document.getElementById('location');
    var searchBox = new google.maps.places.SearchBox(input);
    console.log(input);

    //puts the map view controls on the map in the top left
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log(place.geometry);
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

}
//console.log("text: " + input.val());

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}
